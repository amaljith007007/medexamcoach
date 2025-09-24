# Medical Exam Question Bank - MedExam Pro

## Overview

MedExam Pro is a comprehensive medical exam preparation platform designed for medical professionals studying for board exams and certifications. The application provides a question bank system similar to platforms like Pastest, BMJ OnExamination, and Passmedicine. It features practice modes, timed mock exams, progress tracking, and subscription-based access to premium content.

The platform is built as a full-stack web application with a React frontend, Express.js backend, and PostgreSQL database, designed to be educational, accessible, and focused on maximizing learning outcomes for medical professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for development tooling
- **UI Components**: Radix UI primitives with custom Shadcn/UI components for consistent design
- **Styling**: Tailwind CSS with a custom design system optimized for medical content
- **State Management**: TanStack Query for server state and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom light/dark mode implementation with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with `/api` prefix for all endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **Build System**: esbuild for production bundling, tsx for development

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Session Storage**: PostgreSQL-based session persistence using connect-pg-simple
- **Data Models**: Users, categories, questions, user progress, mock exams, and subscription tracking

### Authentication and Authorization
- **Authentication Strategy**: Custom email/password authentication with bcrypt hashing
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Authorization Levels**: Role-based access with free and premium subscription tiers
- **Security**: CSRF protection, secure session cookies, and input validation

### Design System and UI
- **Design Philosophy**: Material Design principles optimized for medical education
- **Color Palette**: Medical blue primary colors with accessibility-focused contrast ratios
- **Typography**: Inter font family for readability of medical content
- **Component Library**: Fully custom component system built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with specific considerations for exam-taking interfaces

### Question Bank Architecture
- **Content Organization**: Hierarchical category system for medical specialties
- **Question Types**: Multiple choice questions with 5 options, explanations, and difficulty levels
- **Progress Tracking**: Detailed analytics on user performance by category and over time
- **Mock Exam Engine**: Timed examination system with randomized question selection

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

### Payment Processing
- **Stripe**: Subscription management and payment processing
- **Stripe Checkout**: Hosted payment flows for subscription upgrades
- **Webhook Integration**: Real-time subscription status updates

### UI and Component Libraries
- **Radix UI**: Headless UI primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and caching

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment compatibility with runtime error handling

### Additional Integrations
- **Date-fns**: Date manipulation and formatting utilities
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema parsing
- **Wouter**: Lightweight client-side routing solution