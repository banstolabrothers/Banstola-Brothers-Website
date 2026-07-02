import { client } from "@/lib/sanity";
import MyButton from "@/components/ui/MyButton";
import SectionCarousel, { CarouselImage } from "../ui/SectionCarousel";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SocialMediaDoc {
  _id: string;
  title: string;
  images?: CarouselImage[];
}

// ── FollowUsSection (server component) ───────────────────────────────────────
// Fetches image data, then hands a plain serialisable array to the client
// carousel. No functions or JSX cross the server/client boundary.

const FollowUsSection = async () => {
  const data = await client.fetch<SocialMediaDoc[]>(
    `*[_type == "socialmedia"] | order(_createdAt desc) {
      _id,
      title,
      images[]{
        _key,
        asset->{ _id, url },
        alt,
        link
      }
    }`,
  );

  const allImages: CarouselImage[] = [];
  data.forEach((doc) => {
    doc.images?.forEach((img) => allImages.push(img));
  });

  if (!allImages.length) return null;

  return (
    <section className="h-fit flex flex-col gap-12 py-32 justify-center items-center overflow-hidden">
      <div className="flex flex-col md:flex-row md:text-center items-center gap-8">
        <h2>Follow Us</h2>
        <MyButton
          type="secondarybutton"
          text="@banstolabrothers"
          link="https://www.instagram.com/banstolabrothers/"
        />
      </div>

      {/* Client component — receives only plain data */}
      <SectionCarousel variant="images" items={allImages} />
    </section>
  );
};

export default FollowUsSection;
