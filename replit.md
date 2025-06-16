# Project Hub - Freelancer Preview & Payment Platform

## Overview

This is a full-stack web application built for freelancers to share secure, watermarked previews of their work with clients and collect payments. The platform provides custom subdomains, timeline-based feedback, and automated file delivery after payment confirmation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with development server

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **File Uploads**: Multer for handling multipart/form-data

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC
- **Session Management**: PostgreSQL-backed sessions with 1-week TTL
- **User Roles**: admin, freelancer, superfreelancer, client
- **Middleware**: Passport.js integration for authentication flows

### File Management
- **Upload Handling**: Multer with 100MB file size limit
- **Storage**: Local filesystem with /uploads endpoint
- **Preview Generation**: Watermarked previews with time/download limits
- **File Types**: Support for images, videos, audio, and PDFs

### Payment Processing
- **Provider**: Stripe with React Stripe.js integration
- **Flow**: Payment intent creation → confirmation → automated delivery
- **Commission**: Configurable commission rates per freelancer
- **Webhooks**: Stripe webhook handling for payment confirmation

### Preview System
- **Watermarking**: Client-side watermark overlay on media files
- **Time Limits**: Configurable preview duration limits
- **Analytics**: Track view counts, engagement, and conversion rates
- **Comments**: Timeline-based feedback system for media files

## Data Flow

### User Registration/Login
1. User initiates login via `/api/login`
2. Redirected to Replit OIDC provider
3. Callback handler processes tokens and creates/updates user
4. Session established with PostgreSQL storage

### Project Creation
1. Freelancer uploads files via drag-and-drop interface
2. Files stored locally, metadata saved to database
3. Project configured with pricing and preview settings
4. Unique preview URL generated for client access

### Client Preview Flow
1. Client accesses preview URL (custom subdomain or direct link)
2. Analytics event tracked for view/interaction
3. Watermarked preview displayed with interaction controls
4. Comments can be added at specific timestamps
5. Payment initiated if client approves

### Payment Processing
1. Stripe payment intent created with project amount
2. Client completes payment via Stripe Elements
3. Webhook confirms payment success
4. Files automatically delivered to client email
5. Commission calculated and tracked

## External Dependencies

### Payment Integration
- **Stripe**: Payment processing, webhook handling
- **React Stripe.js**: Frontend payment components
- **Stripe API**: Server-side payment intent management

### Authentication
- **Replit Auth**: OIDC-based authentication provider
- **Passport.js**: Authentication middleware layer
- **connect-pg-simple**: PostgreSQL session store

### File Processing
- **Multer**: Multipart form data handling
- **Canvas API**: Client-side watermark generation
- **Media APIs**: HTML5 video/audio for preview playback

### UI Framework
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 via Replit
- **Server**: Development server on port 5000
- **Build**: Vite dev server with HMR

### Production Build
- **Client**: Vite build to `dist/public`
- **Server**: esbuild bundle to `dist/index.js`
- **Assets**: Static file serving via Express
- **Environment**: Production NODE_ENV with optimizations

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `STRIPE_SECRET_KEY`: Stripe API secret
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `REPLIT_DOMAINS`: Allowed domains for auth
- `ISSUER_URL`: OIDC issuer URL

## Changelog

- June 16, 2025. Initial setup with core functionality
- June 16, 2025. Enhanced freelancer dashboard with refined UI design
- June 16, 2025. Added mobile navigation component for bottom navigation
- June 16, 2025. Removed Stripe dependencies, prepared for Paystack integration
- June 16, 2025. Added database seeding with test accounts for admin and freelancer roles

## User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Mobile-first approach with bottom navigation on mobile devices.
Performance requirements: Pages should load instantly like an app, not with loading states.