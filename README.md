# Slim Mom

Tam yığın bir kalori takip uygulaması. Proje iki parçadan oluşur:

- `frontend`: React + Vite arayüzü
- `backend`: Express tabanlı REST API

Uygulama günlük kalori ihtiyacını hesaplar, kullanıcı oturumu yönetir, ürün araması yapar ve günlük tüketilen ürünleri diary ekranında saklar.

## Öne Çıkanlar

- Public ve private günlük kalori hesabı
- Kayıt ol, giriş yap, çıkış yap, refresh token akışı
- Korumalı route yapısı
- Ürün arama endpoint’i
- Gün bazlı öğün ekleme, listeleme ve silme
- Swagger dokümantasyonu
- `1440 / 1280 / 768 / 375 / 320` kırılımlarına göre responsive düzen
- Vercel frontend ve Render backend yayını için hazır yapı

## Kullanılan Yapı

### Frontend

- React 18
- Vite 5
- React Router DOM
- Redux Toolkit
- React Hook Form
- Yup
- Axios
- React Datepicker
- modern-normalize

### Backend

- Node.js
- Express
- bcryptjs
- jsonwebtoken
- uuid
- swagger-ui-express
- dotenv

### Veri Saklama

- JSON tabanlı dosya: `backend/data/db.json`

## Klasör Düzeni

```text
.
├── backend
│   ├── data
│   │   └── db.json
│   ├── src
│   │   ├── docs
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   ├── config.js
│   │   ├── db.js
│   │   └── index.js
│   ├── .env.example
│   └── .env.template
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── css
│   │   ├── pages
│   │   └── redux
│   ├── .env.template
│   └── vercel.json
├── render.yaml
└── package.json
```

## Yerel Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+

### Adımlar

1. Bağımlılıkları yükle:

```bash
npm run install:all
```

2. Backend ve frontend için ortam dosyalarını oluştur:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.template frontend/.env
```

3. Geliştirme ortamını iki ayrı terminalde başlat:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

### Varsayılan adresler

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`
- Health check: `http://localhost:4000/health`

## Ortam Değişkenleri

### Frontend

`frontend/.env`

```env
VITE_API_BASE=http://localhost:4000/api
```

### Backend

`backend/.env`

```env
PORT=4000
ACCESS_TOKEN_SECRET=access-secret-change-me
REFRESH_TOKEN_SECRET=refresh-secret-change-me
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=14
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app,https://*.vercel.app
SERVER_PUBLIC_URL=http://localhost:4000
```

### Açıklama

- `FRONTEND_URL`: backend’in temel frontend adresi
- `CORS_ORIGINS`: izin verilen origin listesi
- `SERVER_PUBLIC_URL`: Swagger ve production erişimi için backend public adresi

## Scriptler

### Root

- `npm run install:all`
- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run build`
- `npm run start`

### Backend

- `npm run dev`
- `npm start`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`

## API Uç Noktaları

Base path: `/api`

### Auth

- `POST /auth/register`
- `POST /auth/signin`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Daily Rate

- `POST /public/daily-rate`
- `POST /private/daily-rate`

### Products

- `GET /products?search=<query>`

### Meals

- `POST /meals`
- `GET /meals?userId=<id>&date=DD.MM.YYYY`
- `DELETE /meals/:mealId?userId=<id>&date=DD.MM.YYYY`

## Arayüz Yapısı

Public sayfalar:

- `/`
- `/login`
- `/registration`

Private sayfalar:

- `/calculator`
- `/diary`

Oturum yoksa private route’lar giriş ekranına yönlendirilir.

## Responsive Notları

Arayüz maksimum `1440px` kapsayıcı ile düzenlenmiştir. Çalışılan ana kırılımlar:

- `1280px`
- `768px`
- `375px`
- `320px`

Public, auth ve private sayfalar bu genişliklere göre yeniden hizalanmıştır.

## Dağıtım

### Frontend: Vercel

`frontend/vercel.json` dosyası SPA rewrite ayarı içerir. Vercel üzerinde `frontend` klasörünü root directory olarak seçebilirsin.

Vercel environment variable:

```env
VITE_API_BASE=https://your-render-service.onrender.com/api
```

### Backend: Render

`render.yaml` dosyası temel web service tanımı içerir. Render tarafında environment variable’ları panelden girmen gerekir.

Örnek production değerleri:

```env
PORT=4000
ACCESS_TOKEN_SECRET=strong-secret
REFRESH_TOKEN_SECRET=another-strong-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=14
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
SERVER_PUBLIC_URL=https://your-render-service.onrender.com
```

## Ek Notlar

- Bu proje veritabanı yerine JSON dosyası kullanır.
- `backend/data/db.json` geliştirme için uygundur, yoğun production kullanımına uygun değildir.
- Ürün arama isteği başarısız olursa frontend tarafında yedek ürün listesi devreye girer.
- Swagger arayüzü backend ayağa kalktığında aktif olur.
