# TrekMate - AI-Powered Trekking Guide

A modern web application for booking and managing trekking adventures in India, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏔️ **Trek Catalog**: Browse and explore various trekking destinations across India
- 🔐 **User Authentication**: Secure signup/login with Supabase Auth
- 💳 **Payment Processing**: Integrated payment system for booking treks
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎨 **Modern UI**: Sleek design with smooth animations and transitions
- 🔒 **Secure**: Row Level Security (RLS) with Supabase

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trekmate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL script to create all tables, policies, and functions

### 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs for authentication:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/auth/signup`

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
trekmate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── payment/           # Payment pages
│   │   ├── treks/             # Trek catalog
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   └── lib/                   # Utility libraries
│       └── supabase.ts        # Supabase client
├── public/                    # Static assets
├── supabase-schema.sql        # Database schema
└── package.json
```

## Database Schema

The application uses three main tables:

### Users Table
- Extends Supabase auth.users
- Stores user profile information
- Automatically created via triggers

### Bookings Table
- Stores trek booking information
- Links users to their booked treks
- Tracks payment status

### Payments Table
- Stores payment transaction details
- Links to bookings via foreign key
- Tracks payment status and transaction IDs

## Authentication Flow

1. **Sign Up**: Users create an account with email/password
2. **Email Verification**: Users verify their email address
3. **Sign In**: Users log in with their credentials
4. **Booking**: Authenticated users can book treks
5. **Payment**: Secure payment processing with booking confirmation

## Payment Flow

1. User selects a trek from the catalog
2. If not authenticated, redirected to auth choice
3. After authentication, redirected to payment page
4. User enters payment details
5. Payment is processed and booking is confirmed
6. User is redirected to success page

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 