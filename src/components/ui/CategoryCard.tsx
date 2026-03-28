import Image from "next/image";

interface CategoryCardProps {
  coverimage: string;
  name: string;
}

const CategoryCard = ({ coverimage, name }: CategoryCardProps) => {
  return (
    <div className="w-full max-w-sm transition-shadow duration-300">
      <div className="relative h-[320px] aspect-square">
        <Image
          src={coverimage}
          alt={name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 384px"
        />
      </div>
      <div className="p-4">
        <h4 className="uppercase">{name}</h4>
      </div>
    </div>
  );
};

export default CategoryCard;
