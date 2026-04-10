import store from "@/assets/image/Store.png";
import MyButton from "@/components/ui/MyButton";

import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.store;

const page = () => {
  return (
    <section className="max-w-[1440px] w-full mx-auto p-4 pt-16 pb-24">
      {/* Image Hero Section */}
      <div className=" flex flex-col w-full gap-8">
        <h1>Our Store in Pokhara</h1>
        <div className="flex flex-col md:flex-row w-full gap-16">
          <div className="flex flex-col gap-4 w-full md:w-6/12">
            <p>Grab product whatever you need.</p>
            <p>
              This is also our click and collect address which is 24/7 open.
              <br />
              If closed just give a call and will open store for you.
            </p>
          </div>
          <div className="flex w-full md:w-6/12">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h4>Tersapatti Rd, Pokhara 33700 </h4>
                <p> Opposite side of Pokhara Central Oasis </p>
              </div>

              <MyButton
                type="primarybutton"
                text="Get Direction"
                link="https://www.google.com/maps/dir//Banstola+Brothers"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col md:flex-row w-full gap-1 rounded-3xl overflow-hidden">
          <div className="flex w-full h-[320px] md:h-auto md:w-6/12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14061.556005867795!2d83.98500705!3d28.225870399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2snp!4v1751128652987!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Google Map showing Banstola Brothers location"
            ></iframe>
          </div>
          <div className="flex w-full md:w-6/12">
            <img src={store.src} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
