import Link from "next/link";
import { MoveRightIcon } from "lucide-react";
import MyButton from "@/components/ui/MyButton";

const HistorySection = () => {
  return (
    <section className="flex mx-auto my-auto bg-brand-100">
      <section className="py-32 px-4 flex-col lg:flex-row max-w-7xl gap-16 lg:gap-8 lg:justify-between items-center flex w-full mx-auto">
        <div className="max-w-3xl text-center lg:text-left text-brand-900">
          <h2>Founded in the late 1990s</h2>
          <p>
            by <span className="text-brand-500">Muktinath Banstola,</span>
            <br />
            Introducing Chhurpi from Illam, Paun from Kathmandu
            <br />— establishing Pokhara&apos;s
          </p>
          <h4>FIRST CHURPI & PAUN SHOP</h4>
        </div>

        {/* Replaced MyButton with inline link — swap back once MyButton is converted */}

        <MyButton
          type="primarybutton"
          text="Explore 25 Years"
          link="/story"
          trailicon={<MoveRightIcon size={32} />}
        />
      </section>
    </section>
  );
};

export default HistorySection;
