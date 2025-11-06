# QR Code Generator

## Overview

A web-based QR code generator that allows users to create QR codes from multiple input types: URLs, text, PDFs, images, and link lists. The application provides real-time QR code generation with instant preview and download capabilities. Built with React on the frontend and Express on the backend, the tool prioritizes simplicity and immediate usability without requiring user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing an accessible and customizable Material Design-inspired interface

**Routing**: Wouter for lightweight client-side routing

**State Management**: 
- React hooks for local component state
- TanStack Query (React Query) for server state management and caching
- No global state management (Redux/Context) needed due to simple data flow

**Styling**: 
- Tailwind CSS with custom design tokens defined in CSS variables
- Theme system supporting light/dark modes via CSS custom properties
- Material Design-inspired spacing and typography scale

**Design Principles**:
- Progressive disclosure - showing options only when relevant
- Real-time feedback - QR codes generate as users type
- Mobile-first responsive design with breakpoint at 768px
- Maximum content width of 4xl for optimal readability

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful endpoints for file processing
- `/api/upload/pdf` - Extracts text content from PDF files
- `/api/upload/image` - Processes image files for QR code generation

**File Processing**:
- Multer middleware for multipart/form-data handling
- In-memory storage with 10MB file size limit
- PDF text extraction using pdf-parse library
- Image processing using Sharp library

**Request/Response Flow**:
- JSON API with error handling
- Request logging middleware tracking method, path, status, duration, and response payload
- Raw body preservation for webhook/signature verification scenarios

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless
- Configured through Drizzle ORM
- Schema defined in `shared/schema.ts`
- Database migrations stored in `./migrations` directory

**Current Schema**: Minimal - only file upload response validation (content and fileName)

**Storage Strategy**: 
- No persistent storage of generated QR codes (stateless generation)
- File uploads processed in-memory and immediately converted to QR data
- Drizzle ORM configured but database not actively used in current implementation

### QR Code Generation

**Library**: qrcode (client-side canvas rendering)

**Generation Strategy**:
- Real-time generation as user inputs data
- Canvas-based rendering for display (256px preview)
- Configurable export sizes: 256px, 512px, 1024px, 2048px
- High contrast black/white encoding for maximum scannability
- 2px margin around codes

### External Dependencies

**Core UI Libraries**:
- Radix UI primitives (@radix-ui/*) - Accessible, unstyled component primitives
- Tailwind CSS - Utility-first styling framework
- class-variance-authority - Type-safe variant management
- clsx & tailwind-merge - Conditional class composition

**Form Management**:
- React Hook Form - Form state and validation
- @hookform/resolvers - Schema-based validation resolvers
- Zod - Runtime type validation

**File Processing**:
- pdf-parse - PDF text extraction
- sharp - Image processing and optimization
- multer - Multipart form data handling

**Database & ORM**:
- Drizzle ORM - Type-safe SQL query builder
- @neondatabase/serverless - PostgreSQL serverless driver
- connect-pg-simple - PostgreSQL session store (configured but sessions not implemented)

**Development Tools**:
- Vite - Build tool and dev server
- TypeScript - Type safety across stack
- ESBuild - Production bundling for server
- @replit/* plugins - Replit-specific development features

**Utility Libraries**:
- date-fns - Date manipulation
- nanoid - Unique ID generation
- wouter - Minimal routing solution

### Authentication & Authorization

**Current Implementation**: None - application is completely open access

**Design Decision**: Intentionally no authentication to provide friction-free QR code generation, aligning with the "No Signup Required" tagline

### File Upload Flow

1. User selects PDF or image file via drag-and-drop or file browser
2. Frontend creates FormData and POSTs to `/api/upload/{type}`
3. Multer processes multipart data into memory buffer with 10MB limit
4. Server validates MIME type:
   - PDFs: Only `application/pdf` allowed
   - Images: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp` allowed
5. For PDFs: Extract text content using pdf-parse v2 (max 2000 chars to prevent QR overflow)
6. For Images: Extract metadata (filename, dimensions, format) using Sharp
7. Return extracted content and filename to client as JSON
8. Client generates QR code from returned text content

**Why Backend Processing**: Image and PDF file data is too large to encode directly into QR codes. The backend extracts meaningful text content that fits within QR code size limits while maintaining the utility of the feature.

## Feature Set

### QR Code Types Supported

1. **URL/Website**: Direct text input for any URL
2. **Text**: Free-form text with 2000 character limit and live character counter
3. **PDF**: Upload PDF files to extract and encode text content
4. **Image**: Upload images to encode file metadata
5. **Link List**: Build multiple labeled links into a single QR code

### QR Code Features

- **Real-time Generation**: QR codes update instantly as content changes (debounced for performance)
- **Download Options**: Export as PNG in 4 sizes (256px, 512px, 1024px, 2048px)
- **Copy to Clipboard**: One-click copy QR code image to clipboard
- **High Contrast**: Black on white for maximum scannability
- **Proper Margins**: 2px quiet zone around QR codes

### User Experience

- **No Signup Required**: Complete functionality available without authentication
- **Tabbed Interface**: Clear navigation between content types
- **Responsive Design**: Works on mobile and desktop (breakpoint at 768px)
- **Loading States**: Visual feedback during file uploads
- **Error Handling**: Toast notifications for upload errors
- **Empty States**: Clear guidance when no content is entered

### Build & Deployment

**Development**: 
- `npm run dev` - Runs Vite dev server with HMR and Express API server
- Custom Vite middleware mode integrating with Express

**Production Build**:
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild bundles Express server to `dist/index.js`
- Single Node process serves both static files and API

**Environment Variables**:
- `DATABASE_URL` - PostgreSQL connection string (required by config, optional in runtime)
- `NODE_ENV` - Development/production mode switching