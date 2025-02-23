import "../styles/globals.css";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import WalletProviderWrapper from "../components/WalletProviderWrapper";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ticket Chain",
  description: "Just book your tickets and enjoy the events in your city",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-20 min-h-screen bg-gray-50">
          <WalletProviderWrapper>{children}</WalletProviderWrapper>
        </main>
      </body>
    </html>
  );
}
