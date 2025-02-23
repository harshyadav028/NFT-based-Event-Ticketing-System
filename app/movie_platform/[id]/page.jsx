// app/movie_platform/[id]/page.js
"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch("/movies.json");
      const data = await res.json();
      const selectedMovie = data.find((m) => m.id === id);
      setMovie(selectedMovie);
    };
    fetchMovie();
  }, [id]);

  const handleClick = () => {
    alert("Book tickets for this movie");
    router.push(`/nfts`);
  };

  if (!movie)
    return <p className="text-center py-10">Loading movie details...</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          <img
            src={movie.heroImage}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-4 ">{movie.title}</h1>
                <p className="mb-4">{movie.description}</p>
                <button
                  onClick={handleClick}
                  className="px-6 py-2 bg-white text-black rounded-lg flex items-center gap-2"
                >
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold mb-6 text-black">
            Browse By Category
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {movie.categories.map((category) => (
              <div
                key={category.id}
                className="relative rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80">
                  <p className="text-white font-medium">{category.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Picks Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold mb-6 text-black">
            Top Picks Near You
          </h2>
          <div className="space-y-4">
            {movie.topPicks.map((pick) => (
              <div
                key={pick.id}
                className="flex items-center gap-4 bg-white rounded-lg p-3 hover:bg-gray-50"
              >
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-black">{pick.title}</h3>
                  <p className="text-gray-600 text-sm">{pick.description}</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                  Get Tickets
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetails;
