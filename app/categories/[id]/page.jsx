"use client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CategoryMovies() {
  const router = useRouter();
  const { id } = useParams(); // id here is the category id
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch("/moviesData.json");
      const data = await res.json();
      // Find the category by matching categoryId
      const selectedCategory = data.find((cat) => cat.categoryId === id);
      setCategory(selectedCategory);
    };
    fetchCategory();
  }, [id]);

  const handleClick = (movieId) => {
    router.push(`/nfts`);
  };

  if (!category) {
    return (
      <p className="text-center mt-10">No movies found for this category.</p>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-10 text-center">
        {category.categoryName}
      </h1>
      <div className="grid grid-cols-3 gap-20">
        {category.movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[360px] mx-auto h-[450px]"
          >
            <div className="relative h-80">
              <Image
                src={movie.heroImage || "/placeholder.svg"}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600">
                {movie.date}
              </h3>
              <p className="text-xl font-bold truncate mt-2">{movie.title}</p>
              <button
                onClick={() => handleClick(movie.id)}
                className="mt-3 w-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg text-sm transition-colors"
              >
                Get Tickets
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
