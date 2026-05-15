import Image from "next/image";
import bgImage from "@/assets/image/photo.webp";

const HeroSection = () => {
  const startYear = 1999;
  const yearsActive = new Date().getFullYear() - startYear;
  return (
    <section className="relative flex flex-col w-full bg-brand-500 text-brand-100 mx-auto text-center items-center justify-center py-16 md:py-56 gap-4">
      <Image
        src={bgImage}
        alt="Background Image"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        priority
        className="opacity-30 2xl:object-top"
      />
      <h1 className="text-brand-100 z-10 drop-shadow-2xl">
        Celebrating {yearsActive}+ years
      </h1>
      <p className="text-2xl sm:text-3xl lg:text-4xl leading-[140%] max-w-5xl px-4 z-10 drop-shadow-2xl">
        Since the late 1990s, we've carried one simple promise — bringing the
        pure, authentic taste of Ilam's handcrafted Chhurpi all the way to
        Pokhara. Founded by Muktinath Banstola, our journey began with a love
        for original taste and an uncompromising belief in quality.
      </p>
    </section>
  );
};

export default HeroSection;
