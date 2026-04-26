import Image from "next/image";
import bgImage from "@/assets/image/photo.webp";
import map from "@/assets/svg/nepal.svg";
import stick2 from "@/assets/image/stick2.png";
import store from "@/assets/image/Store.png";

import { pageMeta } from "@/lib/metadata";
import MyButton from "@/components/ui/MyButton";
export const metadata = pageMeta.story;

const page = () => {
  const startYear = 1999;
  const yearsActive = new Date().getFullYear() - startYear;
  return (
    <section className="flex flex-col w-full">
      {/* Hero Section */}
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

      {/* Source Section */}
      <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
        <div className="flex flex-col md:flex-row max-w-[860] mx-auto gap-4 w-full items-center ">
          <h2 className="w-full">Straight from the hills of Nepal to You.</h2>
          <p className="w-full">
            We have partnered directly with farmers from the regions where the
            finest Chhurpi has always been made — so you receive it fresh,
            original, and at its true quality.
          </p>
        </div>

        <Image
          src={map}
          alt="Background Image"
          sizes="(max-width: 768px) 40vw, 33vw"
          className="w-10/12 md:w-8/12 mx-auto "
          priority
        />
      </section>

      {/* Our Chhurpi Journey */}
      {/* <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
        <div className="flex flex-col  max-w-[860] mx-auto gap-4 w-full text-center ">
          <h2>
            Our Chhurpi Journey <br />
          </h2>
          <p>
            Take a look at the incredible journey our Chhurpi make from our
            partner farms to you!
          </p>
        </div>
        <div className="relative">
          <h1 className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 mix-blend-overlay text-white/40 text-center z-20">
            BANSTOLA BROTHERS <br />
          </h1>
          <Image
            src={stick2}
            alt="Banstola Brothers Chhurpi Image"
            // sizes="(max-width: 768px) 40vw, 33vw"
            className="w-full md:w-8/12 mx-auto mix-blend-multiply z-0 "
            quality={100}
            priority
          />
        </div>
      </section> */}

      {/* Chhurpi Photo */}
      <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
        <div className="flex flex-col  max-w-[860] mx-auto gap-4 w-full text-center ">
          <h2>
            Our Original Chhurpi <br />
          </h2>
          <p>
            Every block of quality Chhurpi begins its journey in the
            high-altitude farms of Ilam and Taplejung — Nepal's most renowned
            regions for traditional dairy craftsmanship. We ensure every piece
            meets the highest standard of quality.
          </p>
        </div>
        <div className="relative">
          <h1 className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 mix-blend-overlay text-white/40 text-center z-20">
            BANSTOLA BROTHERS <br />
          </h1>
          <Image
            src={stick2}
            alt="Banstola Brothers Chhurpi Image"
            // sizes="(max-width: 768px) 40vw, 33vw"
            className="w-full md:w-8/12 mx-auto z-10 "
            quality={100}
            priority
          />
        </div>
      </section>

      {/* Store Photo */}
      <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
        <div className="flex flex-col max-w-[860] mx-auto gap-4 w-full text-center justify-center ">
          <h2>
            Get Original Chhurpi at our Store <br />
          </h2>
          <p>If closed just give a call and will open store for you.</p>
          <Image
            src={store}
            alt="Banstola Brothers Chhurpi Image"
            // sizes="(max-width: 768px) 40vw, 33vw"
            className="w-[420] h-[420] mx-auto object-none rounded-4xl "
            quality={100}
            priority
          />
          <div className="flex flex-col gap-2 justify-center items-center mx-auto ">
            <h4>Tersapatti Rd, Pokhara 33700 </h4>
            <p> (Opposite side of Pokhara Central Oasis) </p>
            <MyButton
              type="primarybutton"
              text="Get Direction"
              link="https://www.google.com/maps/dir//Banstola+Brothers"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      {/* <section className=" w-full mx-auto text-center ">
        <div className="relative z-10 max-w-6xl flex flex-col mx-auto">
          <h2>
            Showing diff extraction of Churpi <br />
          </h2>
        </div>
      </section> */}

      {/* Our Promise Section */}
      {/* <section className=" w-full mx-auto text-center ">
        <div className="relative z-10 max-w-6xl flex flex-col mx-auto">
          <h1>Single Origin </h1>
        </div>
      </section> */}
    </section>
  );
};

export default page;
