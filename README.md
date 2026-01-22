# 🍔 BiteRoute – Food Delivery Website (MERN Stack)

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey?logo=express)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.6.1-orange?logo=socket.io)](https://socket.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blueviolet)](https://razorpay.com/)
[![Google Auth](https://img.shields.io/badge/Google%20OAuth-Login-red?logo=google)](https://developers.google.com/identity)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Uploads-blue?logo=cloudinary)](https://cloudinary.com/)

**BiteRoute** is a **full-featured Food Delivery App** inspired by **Zomato and Swiggy**, built with the **MERN Stack**. It allows users to **order food**, **track deliveries live on the map**, and make **secure payments**. The platform also provides dashboards for **owners** and **delivery personnel**, making it a complete end-to-end solution.

---

## ✨ Features

### 🍴 User Features

[![Google Login](https://img.shields.io/badge/Google%20Login-Login-red)]()
[![Cart](https://img.shields.io/badge/Cart-Add_to_Cart-blue)]()
[![Checkout](https://img.shields.io/badge/Checkout-Payments-green)]()
[![Live Tracking](https://img.shields.io/badge/Live_Tracking-Map-9cf)]()
[![Password Reset](https://img.shields.io/badge/Password_Reset-OTP-yellow)]()
[![Order History](https://img.shields.io/badge/Order_History-Orders-orange)]()
[![Rating](https://img.shields.io/badge/Rating-Food-purple)]()

- Google One-Tap Authentication
- Browse shops and food items by category
- Add items to cart and checkout with Razorpay
- Real-time live tracking of orders 🌍
- Password reset via Email OTP
- View order history and rate food items

### 🏪 Restaurant / Owner Features

[![Manage Shops](https://img.shields.io/badge/Manage_Shops-Shop-blueviolet)]()
[![Manage Menu](https://img.shields.io/badge/Manage_Menu-Food-green)]()
[![Orders](https://img.shields.io/badge/Orders-Update-orange)]()
[![Status](https://img.shields.io/badge/Status-Update-yellow)]()
[![Delivery Tracking](https://img.shields.io/badge/Delivery_Tracking-Live-9cf)]()

- Create and manage shops & menu items
- Accept or reject orders
- Update order status (pending, preparing, delivered)
- View live delivery tracking

### 🚴 Delivery Person Features

[![Assignments](https://img.shields.io/badge/Assignments-Delivery-blue)]()
[![Earnings](https://img.shields.io/badge/Earnings-Today-green)]()
[![Live Location](https://img.shields.io/badge/Live_Location-Tracking-orange)]()

- Receive delivery assignments
- Accept and update delivery status
- View today’s deliveries and earnings
- Live location updates for customers

### 💳 Payment Integration

[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-blueviolet)]()

- Secure Razorpay payment gateway

---

## 🛠️ Technologies Used

**Frontend:**

- React.js (Vite)
- Tailwind CSS / Custom CSS
- Axios for API calls
- React Router DOM
- React Hot Toast (notifications)
- Redux Toolkit
- Framer Motion (animations)

**Backend:**

- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io (real-time tracking & notifications)
- Razorpay (payments)
- Google OAuth (authentication)
- Cloudinary (media uploads)
- dotenv (environment configuration)

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/PrethigahShanmugarajah/BiteRoute
cd BiteRoute
```

### 2️⃣ Backend Setup

```bash
cd Server
npm install
npm run server
```

### 3️⃣ Frontend Setup

```bash
cd Client
npm install
npm run dev
```

---

## 🔑 Environment Variables Setup

### 📂 Backend `.env` (Server/)

```
PORT=
MONGODB_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
EMAIL=
PASS=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 📂 Frontend `.env` (Client/)

```
VITE_BASEURL=
VITE_FIREBASE_APIKEY=
VITE_GEOAPIKEY=
VITE_RAZORPAY_KEY_ID=
```

---

## 📎 Project Link

[GitHub Repository](https://github.com/PrethigahShanmugarajah/BiteRoute)

---

## 👨‍💻 Author

**Prethigah Shanmugarajah (2020/2021)**<br>
Department of Software Engineering, <br>
Faculty of Computing,<br>
Sabaragamuwa University of Sri Lanka.

---
