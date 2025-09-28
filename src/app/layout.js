import "./globals.css";
import { Providers } from '../store/Providers';

export const metadata = {
  title: "Delivery Admin Dashboard",
  description: "Admin dashboard for delivery management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
