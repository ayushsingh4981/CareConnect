# 🩺 CareConnect – Nursing Care Appointment Platform

**CareConnect** is a full-stack web application designed to help users easily book verified nurses for home-based healthcare services. It provides a secure, role-based experience for users, nurses, and admins. Built with React, Vite, Tailwind CSS, Supabase, and generated using AI platforms like Lovable and Bolt.new.

---

## 🚀 Live Demo

> Coming soon – Add your frontend/backend deployment links here.

---

## ✨ Features

### 🔐 Authentication
- Supabase email/password login
- Role-based access: `user`, `nurse`, `admin`
- Auth state handled with React Context
- Redirect to respective dashboards after login

### 👤 User Dashboard
- View upcoming appointments
- Book new appointment (select nurse, date, time, notes)
- View list of nurses with specialization & location
- Secure appointment creation (status: `pending`)

### 🧑‍⚕️ Nurse Dashboard
- View assigned appointments
- See patient name, time, notes
- Clean, readable appointment cards

### 🛠️ Admin Dashboard
- View all appointments (pending, approved, completed)
- Approve or reject appointments
- Manage nurse listings (view/edit)

---

## 🧱 Tech Stack

### 🖼️ Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Context API](https://reactjs.org/docs/context.html)
- [React Hot Toast](https://react-hot-toast.com/)

### 🧠 Backend
- [Supabase](https://supabase.com/)
  - Supabase Auth (email/password login)
  - Supabase PostgreSQL Database
  - Supabase Client (via `@supabase/supabase-js`)
  - RLS (Row-Level Security) policies
- [Bolt.new](https://bolt.new/) – used to generate backend logic and Supabase integration

### 🛠️ AI Tools Used
- [Bolt.new](https://bolt.new/) – for backend schema, APIs, and logic

---

## 📁 Folder Structure
careconnect/
├── public/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Dashboard pages (User, Nurse, Admin)
│ ├── auth/ # AuthContext & Supabase client
│ ├── routes/ # Protected Routes & Routing config
│ ├── App.jsx
│ └── main.jsx
├── supabase/ # Supabase schema (if exported)
├── tailwind.config.js
├── vite.config.js
└── README.md

---

## 🧪 Setup & Running Locally

1. **Clone the repo**
```bash
git clone https://github.com/your-username/careconnect.git
cd careconnect
```

#Install dependencies

```bash
npm install
```

Configure Supabase

Create a project at supabase.com

Replace Supabase URL and anon key in your .env file:

```env

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```
Start the dev server

```bash
npm run dev
```
📊 Database Schema (Supabase)
profiles: id, email, role (user, nurse, admin)

appointments: id, user_id, nurse_id, date, time, notes, status

nurses: id, name, specialization, location, availability

All tables secured with Row-Level Security (RLS) for safe access control.

🔮 Future Improvements
 Add Stripe payment for booking appointments

 Enable smart nurse matching by location and schedule

 Allow profile editing for nurses and users

 Add notifications and reminders

 Build analytics dashboard (revenue, top nurses)

 Deploy as mobile-friendly PWA

👏 Credits
Built using   Bolt.new (FRONTEND & BACKEND)

Supabase for powerful backend & auth

Tailwind CSS for beautiful, fast UI

📃 License
This project is open-source and free to use for educational or demo purposes.


