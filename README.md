# PadelBook Frontend

The premier padel court booking platform designed for efficiency and speed. Built with Next.js 16, Tailwind CSS, and fully integrated with a microservices ecosystem.

## Main Features

### Customer Experience
- Real-time Booking System: Interactively select courts, dates, and session times.
- Integrated Payment: Supports various payment methods via Midtrans (VA, E-Wallet, Credit Card).
- Automated Invoices: Download PDF payment proofs directly from the dashboard after successful payment.
- Booking History: Monitor order status (Paid, Pending Payment, Expired) in a clean, unified view.
- Responsive Design: Modern UI optimized for both mobile and desktop access.

### Admin Management
- Dynamic Statistics: Real-time monitoring of Total Revenue, Order Count, Total Courts, and Schedules.
- Schedule Management: Automatically generate monthly schedules and manage court session availability.
- Order Management: Access detailed order information, including customer data and selected sessions.
- Advanced Pagination: Efficient data navigation for large transaction volumes.
- Quick Search: Filter schedules and orders by name or ID.

## Tech Stack
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS
- Icons: Heroicons & React Icons
- Date Handling: Moment.js & React Datepicker
- Notifications: React Toastify & SweetAlert2
- State Management: React Context API (Auth Provider)

## Installation

1. Clone this repository.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (Use legacy-peer-deps flag if version conflicts occur):
   ```bash
   npm install --legacy-peer-deps
   ```
4. Configure Environment Variables (.env):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   # Configure other services as needed
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

## UI Architecture
This application follows an Atomic/Organism design pattern for components:
- src/components/atoms: Basic components (Buttons, Badges).
- src/components/organisms: Complex components (Footer, Header, Detail Cards, Schedule Grids).
- src/app/admin: All administrator functional modules.
- src/app/dashboard: Dedicated modules for customers.

## Backend Integration
The frontend communicates with 4 primary services:
1. User Service: Authentication and Profile management.
2. Field Service: Court and schedule slot management.
3. Order Service: Order creation and status synchronization.
4. Payment Service: Midtrans payment link generation and webhook handling.
