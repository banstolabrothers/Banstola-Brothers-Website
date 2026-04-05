import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/svg/banstola brothers vertical.svg";
import { footerData } from "./footerData";

const Footer = () => {
  return (
    <div className="flex bg-brand-100 py-20 px-4">
      {/* Main Layout: 2 Columns */}
      <div className="max-w-6xl w-full mx-auto my-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Column 1: Logo (Full height) */}
        <div className="w-full">
          <Link href="/">
            <Image
              src={logo}
              alt="Banstola Brothers"
              className="w-full lg:w-auto lg:h-full"
            />
          </Link>
        </div>

        {/* Column 2: Right side with 2 rows */}
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-row gap-4">
            {/* Link Groups */}
            <div className="flex flex-wrap gap-4 w-full">
              {footerData.linkGroups.map((group, index) => (
                <div key={index} className="min-w-36">
                  <h5 className="text-brand-900 mb-4">{group.title}</h5>

                  {/* Check if it's social media section */}
                  {group.isSocial ? (
                    <div className="flex gap-4">
                      {group.socialMedia?.map((social, socialIndex) => (
                        <a
                          key={socialIndex}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-70 transition-opacity"
                          aria-label={social.name}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {group.links?.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.path}
                            className="text-brand-900 hover:underline hover:opacity-70 hover:underline-offset-4"
                            rel="me"
                          >
                            <p>{link.label}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
          <label className="text-brand-900">
            © {new Date().getFullYear()} Banstola Brothers. All Right Reserved.
          </label>
        </div>
      </div>
    </div>
  );
};

export default Footer;
