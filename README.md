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
