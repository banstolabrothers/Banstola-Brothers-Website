import MyButton from "../ui/MyButton";

const LocationSection = () => {
  return (
    <section className="flex flex-col md:flex-row max-w-[1440] w-full mx-auto my-16 p-4 bg-brand-100 rounded-4xl ">
      <div className="w-full md:max-w-8/12 flex">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2785.8735812811387!2d83.98910867902539!3d28.22835600604602!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2sus!4v1786775189898!5m2!1sen!2sus"
          width="100%"
          height="100"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Google Map showing Banstola Brothers location in Pokhara"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[480] md:h-[640] rounded-2xl"
        />
      </div>
      <div className="w-full md:max-w-4/12 flex flex-col p-6 md:p-8 gap-4 md:gap-6 text-brand-900">
        <div className="flex flex-col gap-1">
          <h3>Banstola Brothers</h3>
        </div>

        <div className="flex flex-row md:flex-col gap-1 w-full ">
          <p className="text-brand-900/80">Address</p>
          <p className="w-full text-right md:text-left">
            Tersapatti Rd, Pokhara 33700
          </p>
        </div>
        <div className="flex flex-row md:flex-col gap-1 w-full ">
          <p className="text-brand-900/80">Phone</p>
          <p className="w-full text-right md:text-left">
            (+977) 9846054755, 9856041086
          </p>
        </div>
        <div className="flex flex-row md:flex-col gap-1 w-full ">
          <p className="text-brand-900/80">Open</p>
          <p className="w-full text-right md:text-left">9am ~ 7pm</p>
        </div>
        <p>If closed just give a call and will open store for you.</p>
        <div className="w-full flex gap-2 ">
          <MyButton
            type="primarybutton"
            text="Get Direction"
            link="https://www.google.com/maps/dir//Banstola+Brothers"
          />
          <MyButton
            type="secondarybutton"
            text="Call Now"
            link="tel:+9779824119665"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
