"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import HeroSlider from "@/components/HeroSlider";

const EventMarketplace = () => {
  const router = useRouter();

  // Fixed handleClick to return a function instead of calling router.push directly
  const handleClick = (id) => () => {
    router.push(`/movie_platform/${id}`);
  };

  // Fixed handleClick to return a function instead of calling router.push directly
  const handleCategoryClick = (id) => () => {
    router.push(`/categories/${id}`);
  };

  const handleSeeAllClick = () => {
    router.push(`/categories/3`);
  };

  const categories = [
    {
      id: 1,
      name: "Concerts",
      image: "/assets/concerts_@.jpg",
    },
    { id: 2, name: "Sports", image: "/assets/sports.jpeg" },
    { id: 3, name: "Movies", image: "/assets/Theater.jpeg" },
    { id: 4, name: "Stand Up", image: "/assets/Stand up.jpeg" },
  ];

  const topPicks = [
    {
      id: 1,
      title: "MUFASA",
      date: "Feb 23",
      image: "/assets/E2.avif",
    },
    {
      id: 2,
      title: "OPPENHEIMER",
      date: "Feb 24",
      image: "/assets/Oppenheimer.jpg",
    },
    {
      id: 3,
      title: "AVENGERS: ENDGAME",
      date: "Feb 25",
      image: "/assets/Avengers End Game.jpeg",
    },
    {
      id: "17",
      title: "KGF: Chapter 2",
      date: "Feb 26",
      description:
        "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes, while the government sees him as a threat to law and order. Rocky must battle threats from all sides for unchallenged supremacy.",
      image: "/assets/Kgf 2-banner.jpeg",
      categories: [
        { id: 1, name: "Crime", image: "/assets/crime.jpg" },
        { id: 2, name: "Action", image: "/assets/Action.jpg" },
      ],
      topPicks: [
        {
          id: 1,
          title: "The Black Hole",
          description: "Facing the unknown.",
          image: "/api/placeholder/120/120",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-black">
          Browse By Category
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              onClick={handleCategoryClick(category.id)}
              key={category.id}
              className="relative rounded-lg overflow-hidden cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Top Picks Near You</h2>
          <button onClick={handleSeeAllClick} className="text-primary text-sm">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topPicks.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[380px] mx-auto h-[450px]" // Increased width & height
            >
              <div className="relative h-80">
                {" "}
                {/* Increased image height */}
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600">
                  {event.date}
                </h3>
                <p className="text-base font-bold truncate mt-2">
                  {event.title}
                </p>
                <button
                  onClick={handleClick(event.id)}
                  className="mt-3 w-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors"
                >
                  Get Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventMarketplace;
