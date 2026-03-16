# Wedding Planner Application

A comprehensive wedding planning tool to help couples organize their special day.

## Features

- **Task Management**: Track all wedding planning tasks with categories, timelines, and due dates
- **Budget Tracking**: Monitor expenses across all categories with real-time budget allocation
- **Guest List Management**: Manage RSVPs, meal preferences, dietary restrictions, and guest details
- **Vendor Management**: Store and organize all vendor contacts and information
- **Partner Collaboration**: Share your planning with your partner using a unique join code
- **Dashboard Analytics**: Visual progress tracking and planning overview
- **Data Export**: Export tasks, budget, guests, and vendors to CSV format

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── data/           # Static data and task templates
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions and services

supabase/
├── migrations/     # Database migration files
└── functions/      # Supabase Edge Functions
```

## Database Schema

The application uses Supabase with the following main tables:
- `couples` - Stores couple information and wedding details
- `tasks` - Wedding planning tasks
- `guests` - Guest list with RSVP tracking
- `vendors` - Vendor contact information
- `meal_types` - Customizable meal type options

All tables have Row Level Security (RLS) enabled for data protection.

## Features in Detail

### Task Management
- Pre-populated task templates for traditional, modern, and destination weddings
- Category-based organization (Venue, Attire, Catering, etc.)
- Timeline view with due date tracking
- Custom task creation
- Task assignment to partners
- Budget tracking per task

### Budget Management
- Real-time budget vs. actual spending tracking
- Category-based budget allocation
- Visual spending overview
- Expense tracking with payment status
- Automatic calculations

### Guest List
- RSVP status tracking
- Meal preference management
- Dietary restrictions
- Plus-one management
- Adult and child count tracking
- Export to CSV

### Vendor Management
- Contact information storage
- Category-based organization
- Notes and additional details
- Quick-action contact buttons
- Export to CSV

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for consistent styling
- Component-based architecture

## Support

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## License

Private - All rights reserved
