import Image from "next/image";
import star from "@/assets/svg/star.svg";

interface RenderStarsProps {
  rating: number;
  size?: number;
}

const RenderStars = ({ rating, size = 24 }: RenderStarsProps) => (
  <>
    {Array.from({ length: 5 }, (_, i) => (
      <Image
        key={i}
        src={star}
        alt={i < rating ? "filled star" : "empty star"}
        width={size}
        height={size}
        className={`transition-opacity ${i < rating ? "opacity-100" : "opacity-20"}`}
      />
    ))}
  </>
);

export default RenderStars;
