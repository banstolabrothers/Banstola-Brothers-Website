import Image from "next/image";
import logo from "@/assets/svg/banstola brothers vertical.svg";
import { footerData, type FooterLink } from "./footerData";
import { TransitionLink } from "@/components/transition/TransitionLink";

// ── FooterLinkItem ────────────────────────────────────────────────────────────

const FooterLinkItem = ({ link }: { link: FooterLink }) => {
  const textClass =
    "text-brand-900 hover:underline hover:underline-offset-4 hover:opacity-70 transition-opacity";
  const iconClass = "hover:opacity-70 transition-opacity";

  const content = link.icon ?? <p>{link.label}</p>;

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
        className={link.icon ? iconClass : textClass}
      >
        {content}
      </a>
    );
  }

  return (
    <TransitionLink
      href={link.href}
      aria-label={link.label}
      className={link.icon ? iconClass : textClass}
    >
      {content}
    </TransitionLink>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  return (
    <div className="flex bg-brand-100 pt-40 pb-20 px-4">
      <div className="w-full my-auto flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Logo — also uses TransitionLink */}
        <div className="w-full lg:w-3/8">
          <TransitionLink href="/">
            <Image
              src={logo}
              alt="Banstola Brothers"
              className="w-full lg:w-auto lg:h-full"
            />
          </TransitionLink>
        </div>

        {/* Link groups */}
        <div className="flex w-full lg:w-5/8 flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 w-full lg:grid-cols-4">
            {footerData.map((group, i) => {
              const hasIcons = group.links.some((l) => l.icon);
              return (
                <div key={i} className="flex flex-col">
                  <h5 className="text-brand-900 mb-4">{group.title}</h5>

                  {hasIcons ? (
                    <div className="flex gap-4 flex-wrap">
                      {group.links.map((link, j) => (
                        <FooterLinkItem key={j} link={link} />
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {group.links.map((link, j) => (
                        <li key={j}>
                          <FooterLinkItem link={link} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-brand-900 text-center lg:text-left">
            © {new Date().getFullYear()} Banstola Brothers. All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
