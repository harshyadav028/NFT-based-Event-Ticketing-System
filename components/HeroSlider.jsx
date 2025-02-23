import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/assets/Avengers endgame.jpeg",
    title: "Get your tickets now",
  },
  { id: 2, image: "/assets/ca.jpeg", title: "Experience live events" },
  {
    id: 3,
    image: "/assets/cexpress.jpeg",
    title: "Unforgettable moments await",
  },
  {
    id: 4,
    image: "/assets/Chhichhore-banner.jpeg",
    title: "Get your tickets now",
  },
  { id: 5, image: "/assets/cring.jpeg", title: "Experience live events" },
  { id: 6, image: "/assets/BMB.jpeg", title: "Unforgettable moments await" },
];

export default function HeroSlider() {
  const router = useRouter();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const handleBookNow = () => {
    router.push(`/nfts`);
  };

  return (
    <div className="relative h-96 bg-gray-900">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="relative h-96">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={`Slide ${slide.id}`}
                fill
                className="object-contain w-full h-full opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
                  <button
                    onClick={handleBookNow}
                    className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-800 rounded-lg text-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
