import Image from "next/image";
import map from "@/assets/svg/nepal.svg";

const SourceSection = () => {
  return (
    <section className="flex flex-col w-full gap-24">
      {/* Source Section */}
      <div className="flex flex-col md:flex-row max-w-4xl text-center mx-auto gap-8 w-full items-center ">
        <h2 className="w-full">Straight from the hills of Nepal to you.</h2>
        <p className="w-full">
          We have partnered directly with farmers from the regions where the
          finest Chhurpi has always been made — so you receive it fresh,
          original, and at its true quality.
        </p>
      </div>

      <Image
        src={map}
        alt="Background Image"
        sizes="(max-width: 860px) 40vw, 33vw"
        className="w-10/12 md:w-8/12 mx-auto "
        priority
      />
    </section>
  );
};

export default SourceSection;
