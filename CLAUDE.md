# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A professional weekly diet plan template for nutritionists built with React and Vite. The application allows nutritionists to create, customize, and export personalized weekly meal plans for their clients.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

This is a single-page React application with the following structure:

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom gradients and responsive design
- **Build Tool**: Vite for fast development and building
- **State Management**: React hooks (useState) for local state

### Core Application Logic

The main application (`src/App.jsx`) is a comprehensive form-based component that manages:

1. **Client Information**: Personal details, health goals, allergies
2. **Weekly Meal Plan**: 7-day grid with 7 meal slots per day (Early Morning through Bedtime)
3. **Supplements**: Table for supplement name, dosage, and timing
4. **Additional Sections**: Foods to avoid, special instructions, follow-up scheduling

### Key Features

- **PDF Export**: Generates HTML-based downloadable diet plans with professional styling
- **Responsive Design**: Mobile-friendly grid layouts that adapt to screen sizes
- **Professional Branding**: Features "JeevanShree - Certified Integrative Nutrition Health Coach" branding throughout
- **Form Validation**: Basic client-side validation for required fields

### State Structure

The application uses several useState hooks to manage complex form state:
- `client`: Object containing all client demographic and health information
- `mealPlan`: Nested object structure (days -> meals -> content)
- `supplements`: Array of supplement objects
- Form fields for instructions, follow-up dates, and contact information

### Styling Approach

- Uses Tailwind CSS utility classes extensively
- Custom gradient backgrounds (green/emerald theme)
- Responsive grid layouts with `grid-cols-2 md:grid-cols-4` patterns
- Professional color scheme with emerald/teal primary colors

## Key Technical Considerations

- The meal plan state is initialized with a nested loop creating empty strings for each day/meal combination
- PDF generation uses blob creation and programmatic download via temporary anchor elements
- All styling is done inline within the PDF generation for proper export formatting
- Form inputs use controlled components with React's onChange pattern