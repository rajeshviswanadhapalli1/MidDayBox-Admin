# Delivery Admin Dashboard

A modern, responsive admin dashboard for managing a delivery system. Built with Next.js, React, and Tailwind CSS.

## Features

### 🔐 Authentication
- Secure login with email and password validation
- Form validation using react-hook-form and yup
- Protected routes with automatic redirects

### 📊 Dashboard
- Statistics overview with orders, users, and schools count
- Recent activity feed
- Quick action buttons
- Responsive design with beautiful cards

### 👥 Users Management
- Two tabs: Delivery Boys and Parents
- Search functionality
- Pagination support
- Status badges for active/inactive users
- Detailed user information display

### 📦 Orders Management
- Comprehensive orders table
- Status filtering (Pending, In Transit, Delivered, Cancelled)
- Search by order ID, customer, or school
- Pagination support
- Status badges with icons

### 💰 Pricing Management
- Distance-based pricing calculator
- Real-time price calculation
- Sample pricing display
- Form validation for price updates
- Interactive price calculator

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Yup
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd delivery-admin
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.js          # Login page
│   ├── dashboard/
│   │   └── page.js          # Dashboard with statistics
│   ├── users/
│   │   └── page.js          # Users management
│   ├── orders/
│   │   └── page.js          # Orders management
│   ├── prices/
│   │   └── page.js          # Pricing management
│   ├── layout.js            # Root layout
│   ├── page.js              # Home page (redirects to login)
│   └── globals.css          # Global styles
├── components/
│   └── Layout.js            # Main layout with sidebar
└── ...
```

## Features in Detail

### Authentication
- Email and password validation
- Show/hide password functionality
- Loading states during login
- Automatic redirect after successful login

### Dashboard
- Real-time statistics cards
- Recent activity timeline
- Quick action buttons for navigation
- Responsive grid layout

### Users Management
- Tabbed interface for Delivery Boys and Parents
- Search functionality across name and email
- Pagination with configurable page size
- Status indicators with color coding
- Action buttons for each user

### Orders Management
- Comprehensive order information display
- Status filtering with dropdown
- Search across multiple fields
- Pagination support
- Status badges with appropriate icons

### Pricing Management
- Current pricing display with visual cards
- Interactive price calculator
- Sample pricing table
- Form validation for price updates
- Real-time calculation updates

## Customization

### Adding New Pages
1. Create a new folder in `src/app/`
2. Add a `page.js` file
3. Import and use the `Layout` component
4. Add navigation item in `src/components/Layout.js`

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/app/globals.css`
- Component-specific styles using Tailwind classes

### Data Integration
Currently, the app uses mock data. To integrate with a real API:
1. Replace mock data with API calls
2. Add proper error handling
3. Implement loading states
4. Add proper authentication with JWT tokens

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
