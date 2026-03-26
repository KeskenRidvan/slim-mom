import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readDB, writeDB } from "../db.js";
import { generateTokens } from "../utils/tokens.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Eksik bilgi." });
  }

  const db = await readDB();
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Bu email zaten kayıtlı." });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  const sessionId = uuidv4();
  const { accessToken, refreshToken, refreshExpiresAt } = generateTokens(
    newUser.id,
    sessionId
  );

  const newSession = {
    id: sessionId,
    userId: newUser.id,
    accessToken,
    refreshToken,
    createdAt: new Date().toISOString(),
    refreshExpiresAt: refreshExpiresAt.toISOString(),
  };

  db.sessions.push(newSession);
  await writeDB(db);

  res.status(201).json({
    accessToken,
    refreshToken,
    user: { id: newUser.id, name, email },
  });
});

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const db = await readDB();
  const user = db.users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Hatalı e-posta veya şifre." });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Hatalı e-posta veya şifre." });
  }

  const sessionId = uuidv4();
  const { accessToken, refreshToken, refreshExpiresAt } = generateTokens(
    user.id,
    sessionId
  );

  const newSession = {
    id: sessionId,
    userId: user.id,
    accessToken,
    refreshToken,
    createdAt: new Date().toISOString(),
    refreshExpiresAt: refreshExpiresAt.toISOString(),
  };

  db.sessions.push(newSession);
  await writeDB(db);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  });
};

router.post("/login", handleLogin);
router.post("/signin", handleLogin);

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token gerekli." });
  }

  const db = await readDB();
  const sessionIndex = db.sessions.findIndex(
    (s) => s.refreshToken === refreshToken
  );

  if (sessionIndex === -1) {
    return res.status(401).json({ message: "Geçersiz oturum." });
  }

  const session = db.sessions[sessionIndex];
  if (new Date(session.refreshExpiresAt) < new Date()) {
    db.sessions.splice(sessionIndex, 1);
    await writeDB(db);
    return res
      .status(401)
      .json({ message: "Oturum süresi dolmuş, tekrar giriş yapın." });
  }

  const {
    accessToken: newAccess,
    refreshToken: newRefresh,
    refreshExpiresAt,
  } = generateTokens(session.userId, session.id);

  db.sessions[sessionIndex] = {
    ...session,
    accessToken: newAccess,
    refreshToken: newRefresh,
    refreshExpiresAt: refreshExpiresAt.toISOString(),
  };

  await writeDB(db);
  res.json({ accessToken: newAccess, refreshToken: newRefresh });
});

router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Yetkisiz işlem." });
  }

  const token = authHeader.split(" ")[1];
  const db = await readDB();

  db.sessions = db.sessions.filter((s) => s.accessToken !== token);
  await writeDB(db);

  res.json({ message: "Başarıyla çıkış yapıldı." });
});

export default router;
