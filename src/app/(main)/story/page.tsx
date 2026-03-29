import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.story;

const page = () => {
  return (
    <section className="flex flex-col">
      <div className=" w-full mx-auto text-center ">
        <section className="relative flex h-[90vh] bg-brand-500 items-center justify-center px-8">
          <div className="relative z-10 max-w-6xl flex flex-col mx-auto">
            <h1 className="text-white">
              Taste of Illam's Chhurpi &
              <br />
              Kathmandu's Pau in Pokhara
            </h1>
            <h1 className="text-white">Since 1999.</h1>
          </div>
        </section>
        <br />
      </div>
    </section>
  );
};

export default page;
