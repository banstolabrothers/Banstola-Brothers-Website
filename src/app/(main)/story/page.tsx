import Image from "next/image";
import store from "@/assets/image/Store.png";
import { pageMeta } from "@/lib/metadata";
import MyButton from "@/components/ui/MyButton";
import SourceSection from "@/components/story/SourceSection";
import HeroSection from "@/components/story/HeroSection";
export const metadata = pageMeta.story;

const page = () => {
  return (
    <section className="flex flex-col w-full">
      <HeroSection />

      <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
        <SourceSection />
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
      {/* <section className="max-w-[1440] flex flex-col w-full mx-auto p-4 py-32 gap-24 justify-center">
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
      </section> */}

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
            <div className="w-full flex items-center justify-center gap-4 ">
              <MyButton
                type="primarybutton"
                text="Get Direction"
                link="https://www.google.com/maps/dir//Banstola+Brothers"
              />
              <MyButton
                type="primarybutton"
                text="Call Now"
                link="tel:+9779824119665"
              />
            </div>
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
