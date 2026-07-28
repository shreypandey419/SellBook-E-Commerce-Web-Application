# SellBook

SellBook is a full-stack bookstore platform with a customer storefront, protected admin panel, inventory-aware ordering, reviews, coupons, invoices, analytics, and transactional email notifications.

## Features

- Email/password and Firebase Google sign-in with JWT-protected APIs
- Book catalogue, search, filters, images, reviews, ratings, cart, and wishlist
- Cash on Delivery and Razorpay checkout
- Coupon validation and discounts
- Customer profiles, order history, PDF invoice downloads, and order emails
- Admin book, inventory, coupon, order-status, invoice, and analytics management
- Automatic stock reduction after successful orders and stock restoration after cancellation

## Screenshots

Add customer storefront, checkout, admin dashboard, coupon management, and invoice screenshots here before release.

## Tech stack

- Frontend/Admin: React, Vite, Tailwind CSS, Framer Motion, Axios
- Backend: Node.js, Express, MongoDB/Mongoose
- Authentication: Firebase Authentication, JWT, bcrypt
- Payments: Razorpay
- Email: Nodemailer/SMTP
- Documents: PDFKit

## Folder structure

```text
SellBook-main/
├── frontend/       # Customer React application
├── admin/          # Admin React application
├── backend/        # Express API, models, services, uploads
└── README.md
```

## Installation

```bash
npm install
npm --prefix frontend install
npm --prefix admin install
npm --prefix backend install
```

## Environment variables

Create local `.env` files (never commit them).

### `backend/.env`

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM="SellBook <noreply@example.com>"
SMTP_SECURE=false

# Optional: enables links in transactional emails
FRONTEND_URL=http://localhost:5173

# Firebase Admin credentials/configuration required by the existing Firebase verifier
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### `admin/.env`

```env
VITE_API_URL=http://localhost:4000
```

## Running locally

Run each application in its own terminal:

```bash
npm run backend:start
npm run frontend:dev
npm run admin:dev
```

Or use the root development command after dependencies are installed:

```bash
npm run dev
```

Customer app: `http://localhost:5173`  
Admin app: use the Vite port shown by the admin dev server.  
API: `http://localhost:4000`

## Admin and user login

- Create/seed an admin through the existing backend admin seed workflow, then sign in via the Admin application.
- Customers can register with email/password or use configured Firebase Google sign-in.
- Do not hardcode production credentials in source code or documentation.

## API overview

| Area | Base route |
| --- | --- |
| Books and reviews | `/api/books`, `/api/reviews` |
| User profile/authentication | `/api/user` |
| Orders and invoices | `/api/orders` |
| Payments | `/api/payment` |
| Coupons | `/api/coupons` |
| Admin/dashboard | `/api/admin` |

All protected customer and admin API calls require their existing JWT bearer token.

## Deployment

1. Build `frontend` and `admin` with `npm run build` in each directory.
2. Set the production environment variables in your host’s secret manager.
3. Configure MongoDB Atlas network access and a strong `JWT_SECRET`.
4. Configure Razorpay production keys and an SMTP provider.
5. Serve the Express API behind HTTPS and configure `FRONTEND_URL` and CORS for the deployed client origins.
6. Persist `backend/uploads` with object storage or a persistent volume. Uploads are intentionally ignored by Git.

## Future improvements

- Object-storage backed image uploads
- Rate limiting and request monitoring
- Shipment tracking and user notification preferences
- Automated integration and end-to-end test coverage

## License

Private project. Add a license before public distribution.




































SellBook – Full Stack Bookstore (Project Explanation)

SellBook is a full-stack MERN-based e-commerce bookstore where users can browse books, authenticate securely, place orders, and administrators can manage the complete store from an admin dashboard.

Tech Stack
Frontend: React.js, Vite, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT + Firebase Google Authentication
Payments: Razorpay + Cash on Delivery
Deployment: Render
Email: Nodemailer
PDF: PDF Invoice generation
User Module
Authentication

Implemented secure authentication using:

Email & Password login
Google Sign-In using Firebase
JWT authentication for protected APIs
Book Catalogue

Users can:

View all books
Search books
Filter by category
Sort books
View book details
Wishlist

Users can:

Add books to wishlist
Remove books
Persist wishlist after login
Cart

Users can:

Add books
Update quantity
Remove items
View subtotal automatically
Checkout

Users provide:

Shipping details
Payment method

Supported payments:

Cash on Delivery
Razorpay Online Payment
Coupon System

Users can:

Apply coupon codes
Get percentage or fixed discounts
Invalid and expired coupons are validated on the backend
Orders

Users can:

Place orders
View My Orders
Download PDF invoices
Receive order confirmation emails
Reviews & Ratings

Authenticated users can:

Submit reviews
Give ratings
View average ratings
Inventory Management

One of the important features I implemented was inventory management.

Before creating an order:

Backend checks available stock.
If requested quantity exceeds available stock, the order is rejected.
Inventory decreases after successful order creation.
Inventory is restored automatically if an order is cancelled.

This prevents overselling.

Admin Panel

The admin dashboard includes:

Book Management
Add books
Edit books
Delete books
Upload cover images
Order Management

Admin can:

View all orders
Update order status

Order flow:

Pending

↓

Confirmed

↓

Processing

↓

Delivered

or

Cancelled

Invalid status transitions are blocked.

Coupon Management

Admin can:

Create coupons
Edit coupons
Delete coupons
Set expiry dates
Analytics Dashboard

Dashboard displays:

Revenue
Total Orders
Pending Orders
Delivered Orders
Average Order Value
Low Stock Books
Out of Stock Books
Monthly Revenue
Monthly Orders
CSV Export

Admin can export sales reports in CSV format.

Email Notifications

Automated emails are sent for:

Order placed
Order confirmed
Processing
Delivered
Cancelled

using Nodemailer.

PDF Invoice

Users can download invoices generated dynamically in PDF format after placing orders.

Security

Implemented:

JWT Authentication
Protected Routes
Role-based Authorization (Admin/User)
Helmet
CORS Configuration
Input Validation
Deployment

Application is deployed on Render:

Backend Web Service
Frontend Static Site
Admin Static Site
Challenges Faced

Some practical issues I solved during development:

JWT authentication flow
Google Login integration
Razorpay payment verification
Inventory synchronization
Order status workflow
Coupon validation
Image uploads
Production deployment
Fixing localhost image URLs after deployment
Handling stock validation with proper HTTP status codes
Key Learnings

Through this project I learned:

Designing REST APIs
Building a complete MERN application
Authentication & Authorization
Payment gateway integration
File uploads
Email services
PDF generation
Inventory management
Deployment on cloud platforms
Debugging production issues
Managing frontend and backend integration
2-Minute Interview Introduction

"SellBook is a full-stack MERN e-commerce bookstore that I developed. It has separate customer and admin applications. Users can sign in using email/password or Google authentication, browse books, manage their cart and wishlist, apply coupons, place orders using Cash on Delivery or Razorpay, download PDF invoices, and receive transactional emails. The admin panel supports book, order, coupon, and inventory management along with analytics and CSV export. I implemented JWT-based authentication, inventory validation to prevent overselling, secure REST APIs, and deployed the backend, frontend, and admin applications on Render. This project gave me hands-on experience with end-to-end MERN development, payment integration, deployment, and production debugging."

Ye explanation resume discussion aur technical interviews dono ke liye suitable hai.
