# Korra

<p align="center">
  <img src="public/logo.png" alt="Korra Logo" width="150" height="150" />
</p>

Korra is a comprehensive platform for pet owners and animal lovers, providing a social space for community engagement, pet services, adoption, and marketplace features.

## 🐾 Features

### 🏠 Community Feed

- Share posts and updates with the pet community
- Toggle between regular posts and rescue/support posts
- Add images to your posts
- Engage with other pet owners

### 💬 Chat

- Real-time messaging between users
- Support for image attachments
- Read receipts
- User-friendly interface

### 🗺️ Pet Services Map

- Find pet shops and services near you
- Filter by service types
- View detailed information about each location
- Get directions to pet-friendly businesses

### 🛒 Marketplace

- Browse and purchase pet products
- Secure checkout with Stripe integration
- Order confirmation and tracking
- Vendor profiles

### 🐶 Adoption

- Browse pets available for adoption
- Filter by species, breed, and location
- Contact pet owners or shelters
- Adoption process tracking

### 💰 Donations

- Support animal welfare organizations
- Secure payment processing
- Donation receipts and tracking

### 👤 User Profiles

- Customizable user profiles
- Pet profiles
- Activity history
- Account settings

## 🚀 Tech Stack

- **Frontend**: React 19, Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth with OAuth providers
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase Realtime
- **Maps**: Leaflet
- **Payments**: Stripe
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form, Zod
- **UI Components**: Radix UI, Lucide React
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18+ or Bun 1.0+
- Supabase account
- Stripe account (for payment features)

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/korra.git
   cd korra
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_VERCEL_URL=your_production_url
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

The app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy!

## 📱 Responsive Design

Korra is designed to work seamlessly across devices:

- Desktop
- Tablet
- Mobile

## 🔒 Authentication

The app supports multiple authentication methods:

- Email/Password
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication

## 🌙 Dark Mode

Korra includes a beautiful dark mode that can be toggled by users.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions or feedback, please reach out to us at [your-email@example.com].

---

Built with ❤️ for pets and their humans.
