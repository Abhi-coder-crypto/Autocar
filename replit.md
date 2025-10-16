# Mauli Car World - Car Parts & Service Management System

## Overview
Mauli Car World is a comprehensive full-stack web application for auto repair shops. It efficiently manages car parts inventory, customer relationships, service workflows, employee management, and sales tracking. The system supports multiple user roles (administrators, inventory managers, sales executives, HR managers, and service staff) with tailored views and permissions, providing a professional dashboard for all automotive service business operations. The business vision is to streamline operations for auto repair shops, enhancing efficiency and customer satisfaction, with market potential in small to medium-sized repair businesses.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React (18+)** and **Vite**, utilizing **TypeScript** for type safety and **Wouter** for client-side routing. **TanStack Query** manages server state. The UI uses **Shadcn/ui** components based on **Radix UI primitives** and styled with **Tailwind CSS**, following a dark-mode-first, information-dense design. It includes a custom theme provider, custom hooks, and maintains a consistent aesthetic with thick orange borders and gradient backgrounds for cards and vehicle images. Features include WhatsApp-style image cropping for employee photos and enhanced customer details displays.

### Backend Architecture
The backend is an **Express.js** RESTful API server, written in **TypeScript**. It features a middleware-based request processing system for logging, error handling, and JSON parsing. API endpoints follow resource-based patterns for CRUD operations. An inactivity timeout system automatically logs out non-admin users after 30 minutes.

### Database Layer
The application exclusively uses **MongoDB** with **Mongoose ODM**. A singleton pattern manages the connection. Schema designs incorporate validation, hooks, virtual fields, and reference-based relationships.

### Data Models & Schemas
Core entities include Product (with multi-image support, variants, barcode, compatibility, warranty, and detailed inventory tracking), RegistrationCustomer (with referral source tracking and auto-generated IDs), RegistrationVehicle (linked to customers, with dynamic fields like selected parts and chassis numbers), Employee (with auto-generated IDs, photo upload, status management, and performance logs), ServiceVisit (with before/after image support), Order, InventoryTransaction, ProductReturn, Supplier, PurchaseOrder, Attendance, Leave, Task, CommunicationLog, and Feedback. **Zod** is used for validation schemas for `RegistrationCustomer` and `RegistrationVehicle`. The `isNew` field was renamed to `isNewVehicle` to resolve Mongoose warnings.

### Vehicle Management Module
A comprehensive vehicle management system that maintains detailed vehicle records per customer with the following features:
- **Auto-generated Vehicle IDs**: Unique sequential IDs in format VEH001, VEH002, etc., using a Counter model
- **Enhanced Vehicle Details**: Vehicle brand, model, variant, color, year of purchase, vehicle number (registration plate), VIN number, chassis number, and photo upload
- **Service Tracking**: Last service date tracking with service history array and warranty records
- **Service Reminders**: Automated endpoint to identify vehicles needing service (6+ months without maintenance)
- **Comprehensive API Routes**: Full CRUD operations with filtering by brand/model/variant/color, search by vehicle ID/number/brand/model/VIN, and service reminder automation
- **Frontend Interface**: Complete vehicle management page with tabs for "All Vehicles" and "Service Reminders", including add/edit/delete functionality, advanced search and filtering, vehicle photo uploads, and customer linking
- **Route Ordering**: Specific routes (`/api/vehicles/service-reminders`, `/api/vehicles/:id`) are correctly ordered before general routes (`/api/vehicles`) in Express to ensure proper request handling

### Authentication & Authorization
The system uses **session-based authentication** with Express sessions and secure HTTP-only cookies. Password hashing is handled by **bcryptjs**. **Role-Based Access Control (RBAC)** defines five distinct roles: Admin, Inventory Manager, Sales Executive, HR Manager, and Service Staff, each with granular permissions. Two-step OTP verification is implemented for login.

### UI/UX Decisions
Global card styling features `border-2 border-orange-300 dark:border-orange-700`. Vehicle images use `border-2 border-orange-300 dark:border-orange-700`, `object-contain`, and gradient backgrounds. Responsive layouts are used for dashboards. Forms feature conditional fields and dynamic dropdowns. Image uploads have live previews, base64 encoding, and validation. Employee photo sizes are increased, and documents are viewed in a dedicated viewer.

### Multi-Vehicle Customer Registration
The customer registration flow supports adding multiple vehicles per customer. After entering customer information and OTP verification, users can add vehicles one at a time. The form displays the count of registered vehicles and provides options to either "Add Another Vehicle" or "Complete Registration" (shown after at least one vehicle is added). The customer dashboard displays a "+X more" badge on customer cards when they have multiple vehicles, showing additional vehicles beyond the primary one.

### Complete Activity Tracking System
A comprehensive activity logging system tracks all user actions (CRUD operations on Employees, Products, Orders, Service Visits, Suppliers, Purchase Orders, and user login/logout) with an `ActivityLog` model. An `ActivityFeed` component in the admin dashboard displays real-time activities with role-based badge colors, action-based indicators, resource icons, and "time ago" formatting. API endpoints for fetching and creating activity logs are provided.

### Inventory Management Module (Hierarchical)
A comprehensive inventory management system with hierarchical product structure for detailed tracking of car accessories and consumables:

**Hierarchical Structure**: Brand → Model → Variant → Product Category → Product Range → Color/Finish

**Data Models**:
- `Brand`: Vehicle brands (Toyota, Hyundai, Maruti Suzuki)
- `VehicleModel`: Car models linked to brands (Innova, i20, Baleno)
- `Variant`: Model variants (Base, Mid, Top, Custom, Standard)
- `ProductCategory`: Product types (Seat Cover, Floor Padding, Alloy Wheel, Music System)
- `ProductRange`: Quality/material ranges (Leather, Fabric, Premium, Deluxe)
- `Vendor`: Supplier management with contact details, GST, payment terms, and outstanding balance tracking
- `InventoryProduct`: Main inventory product with full hierarchy, stock tracking, pricing, vendor linkage, warehouse location, and auto-generated SKU
- `StockMovement`: Complete stock transaction history with quantity changes, references, and user tracking

**Core Features**:
- **Hierarchical Product Entry**: Add products with Brand → Model → Variant → Category → Range → Color structure
- **Stock Management Service**: Auto-deduction when products are used in sales/service orders
- **Low Stock Alerts**: SMS notification system (with Twilio integration placeholder) triggers when stock ≤ reorder level
- **Stock Movement Tracking**: Complete audit trail of all stock changes (purchase, sale, return, adjustment, damage, transfer, restock)
- **Daily Product Movement Summary**: Aggregated reports of stock changes for any date range
- **Vendor Management**: Complete vendor details with invoice tracking and payment management
- **Real-time Stock Monitoring**: Dashboard showing total products, low stock alerts, brands, and vendors

**API Routes** (`/api/inventory/*`):
- Brands, Models, Variants, Categories, Ranges, Vendors: Full CRUD operations
- Products: Create, read, update, delete with hierarchical filtering
- Stock Operations: `/stock/deduct`, `/stock/add`, `/stock/low`
- Stock Movements: `/movements` with filtering, `/movements/summary/daily`, `/movements/summary`

**Frontend Interface** (`/inventory-management`):
- **Products Tab**: Search, filter, and manage inventory products with hierarchy display
- **Hierarchy Setup Tab**: Manage brands, models, variants, categories, and ranges in organized cards
- **Vendors Tab**: Complete vendor management with contact and financial details
- **Low Stock Tab**: Alert dashboard with vendor contact information for reordering
- **Stock Movements Tab**: Complete transaction history with filters

**SMS Alert System**:
- **Notification Service Abstraction**: `server/services/notificationService.ts` provides SMS, email, and in-app notifications
- **Twilio Integration Ready**: Placeholder implementation that logs SMS to console when Twilio credentials are not configured
- **Environment Variables Required**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
- **Alert Triggers**: Automatically sends SMS to Admin and Inventory Manager when stock reaches reorder level
- **Note in replit.md**: SMS functionality requires Twilio credentials to be added as environment variables

**Example Use Case**: 
Seat Cover (Leather - Red) for Toyota Innova Top Variant with stock of 12 units at ₹4,000 each. System auto-alerts when stock ≤ 5 units, sending SMS to configured Admin and Inventory Manager contacts.

## External Dependencies

-   **Database**: MongoDB (via Mongoose)
-   **UI Components**: Radix UI, Shadcn/ui, Tailwind CSS, Lucide React
-   **State & Data Management**: TanStack Query, React Hook Form, Zod
-   **Date & Time**: date-fns
-   **Development Tools**: Vite, esbuild, TypeScript
-   **Deployment**: Vercel
-   **Security**: bcryptjs