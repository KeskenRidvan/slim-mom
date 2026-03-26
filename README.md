# Slim Mom 🥗

A full-stack calorie tracking application built with React and Node.js. The app helps users calculate their daily calorie target, manage authentication, and keep a simple food diary for each day.

## Live Links

- Frontend: [https://slim-mom-green.vercel.app/](https://slim-mom-green.vercel.app/)
- Backend API Docs: [https://slim-mom-ii3s.onrender.com/api/docs/](https://slim-mom-ii3s.onrender.com/api/docs/)

## What This Project Does

- Calculates daily calorie needs
- Supports public and private calorie calculation flows
- Handles registration, login, logout, and token refresh
- Lets authenticated users search products
- Lets authenticated users add, list, and remove meals by date
- Includes Swagger documentation for backend endpoints

## Tech Stack

### Frontend 🎨

- React 18
- Vite
- React Router DOM
- Redux Toolkit
- React Hook Form
- Yup
- Axios
- React Datepicker
- modern-normalize

### Backend ⚙️

- Node.js
- Express
- bcryptjs
- jsonwebtoken
- uuid
- swagger-ui-express
- dotenv

### Data Layer

- JSON-based storage with `backend/data/db.json`

## Project Structure

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

## Main Features

### Authentication

- User registration
- User login
- Logout flow
- Refresh token flow

### Calories

- Public calorie calculation
- Private calorie calculation with saved user data
- Daily rate and restricted food suggestions

### Diary

- Search products
- Add meals for a selected date
- List meals by date
- Delete meals from the diary

## Routing

### Public Pages

- `/`
- `/login`
- `/registration`

### Private Pages

- `/calculator`
- `/diary`

Unauthenticated users are redirected to the login page when trying to access protected routes.

## Responsive Layout 📱

The interface is organized around a max-width desktop shell and adapted for these breakpoints:

- `1440px`
- `1280px`
- `768px`
- `375px`
- `320px`

Public pages, auth screens, and private pages were adjusted for these widths.

## API Overview

Base path:

```text
/api
```

### Auth Endpoints

- `POST /auth/register`
- `POST /auth/signin`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Daily Rate Endpoints

- `POST /public/daily-rate`
- `POST /private/daily-rate`

### Products

- `GET /products?search=<query>`

### Meals

- `POST /meals`
- `GET /meals?userId=<id>&date=DD.MM.YYYY`
- `DELETE /meals/:mealId?userId=<id>&date=DD.MM.YYYY`

## Local Setup

### Requirements

- Node.js 18+
- npm 9+

### Install

```bash
npm run install:all
```

### Create Environment Files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.template frontend/.env
```

### Start the Project

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

### Default Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`
- Health Check: `http://localhost:4000/health`

## Environment Variables

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

## Deployment 🌍

### Frontend on Vercel

Production frontend:

- [https://slim-mom-green.vercel.app/](https://slim-mom-green.vercel.app/)

Recommended environment variable:

```env
VITE_API_BASE=https://slim-mom-ii3s.onrender.com/api
```

### Backend on Render

Production backend docs:

- [https://slim-mom-ii3s.onrender.com/api/docs/](https://slim-mom-ii3s.onrender.com/api/docs/)

Recommended production values:

```env
PORT=4000
ACCESS_TOKEN_SECRET=your-strong-secret
REFRESH_TOKEN_SECRET=your-other-strong-secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=14
FRONTEND_URL=https://slim-mom-green.vercel.app
CORS_ORIGINS=https://slim-mom-green.vercel.app,https://*.vercel.app
SERVER_PUBLIC_URL=https://slim-mom-ii3s.onrender.com
```

## Available Scripts

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

## Notes 📝

- This project uses a JSON file instead of a real database.
- The current storage approach is fine for learning and demo purposes, but not for heavy production use.
- If the product search request fails, the frontend falls back to a local product list.
- Swagger is available when the backend service is running.
