import Link from "next/link";
import { client } from "@/lib/sanity";
import InstagramCarousel from "./InstagramCarousel";
import MyButton from "@/components/ui/MyButton";

interface SanityImage {
  _key: string;
  asset: { _id: string; url: string };
  alt?: string;
  link?: string;
}

interface SocialMediaDoc {
  _id: string;
  title: string;
  images?: SanityImage[];
}

// ✅ Server component — replaces useEffect fetch
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

  // Flatten all images from all docs
  const allImages: SanityImage[] = [];
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

      {/* Client component handles the RAF animation */}
      <InstagramCarousel images={allImages} />
    </section>
  );
};

export default FollowUsSection;
