"use client";
import { useState } from "react";
import {
  Search,
  User,
  Ticket,
  HelpCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Link from "next/link";
import WalletProviderWrapper from "./WalletProviderWrapper";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <WalletProviderWrapper>
      <header className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left section - Logo and Search */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Ticket Chain
              </h1>
            </Link>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right section - Navigation and Profile */}
          <div className="flex items-center gap-6">
            <WalletSelector />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                  <Link href="/profile">
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Profile Details
                      </span>
                    </div>
                  </Link>

                  <Link href="/bookings">
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <Ticket className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">My Tickets</span>
                    </div>
                  </Link>

                  <Link href="/help">
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Help Center</span>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer w-full text-left text-red-600">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </WalletProviderWrapper>
  );
};

export default Navbar;
