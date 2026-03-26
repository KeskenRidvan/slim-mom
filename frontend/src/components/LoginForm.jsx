import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = yup
  .object({
    email: yup.string().email("Gecerli bir e-posta giriniz").required("E-posta zorunludur"),
    password: yup.string().required("Sifre zorunludur"),
  })
  .required();

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      const isClientBlocked =
        !error.response &&
        (error.code === "ERR_NETWORK" ||
          String(error.message || "").includes("ERR_BLOCKED_BY_CLIENT"));

      if (isClientBlocked) {
        alert(
          "Istek tarayici tarafinda engellendi. Reklam engelleyici veya guvenlik eklentisini localhost icin kapatip tekrar deneyin."
        );
        return;
      }

      alert(error.response?.data?.message || "Giris basarisiz. Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          type="email"
          autoComplete="email"
          className="auth-input"
          {...register("email")}
          placeholder="Email *"
        />
        {errors.email && <p className="error-text">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <input
          type="password"
          autoComplete="current-password"
          className="auth-input"
          {...register("password")}
          placeholder="Password *"
        />
        {errors.password && <p className="error-text">{errors.password.message}</p>}
      </div>

      <div className="button-group">
        <button type="submit" className="btn-orange-solid">
          Log in
        </button>
        <button
          type="button"
          className="btn-orange-outline"
          onClick={() => navigate("/registration")}
        >
          Register
        </button>
      </div>
    </form>
  );
}
