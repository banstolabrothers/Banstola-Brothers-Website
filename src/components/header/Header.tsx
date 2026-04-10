"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Drawer } from "vaul";
import headerData from "./headerData";
import Image from "next/image";
import { linksData } from "./linksData";
import MyButton from "@/components/ui/MyButton";
import logo from "@/assets/svg/BanstolaBrothers White.svg";

// ── Register GSAP plugin ─────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Constants ────────────────────────────────────────────────────────────────
const BREAKPOINTS = {
  mobile: 768,
  scroll_threshold: 250,
  animation_duration: 1,
};

const LOGO_CONFIGS = {
  desktop: {
    home: {
      initial: {
        position: "absolute",
        top: "115%",
        left: "50%",
        xPercent: -50,
        yPercent: 20,
        width: "100%",
        height: "auto",
        maxWidth: "1440px",
        scale: 1,
        zIndex: 10,
      },
      final: {
        top: "50%",
        yPercent: -78,
        scale: 0.3,
        zIndex: 99,
      },
    },
    other: {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -40,
      scale: 2.5,
      zIndex: 99,
    },
  },
  mobile: {
    home: {
      initial: {
        position: "absolute",
        top: "115%",
        left: "50%",
        xPercent: -50,
        yPercent: 20,
        width: "100%",
        height: "auto",
        maxWidth: "none",
        scale: 1,
        zIndex: 99,
      },
      final: {
        position: "absolute",
        top: "50%",
        left: "0%",
        xPercent: 0,
        yPercent: -40,
        width: "70%",
        height: "auto",
        maxWidth: "none",
        scale: 1,
        zIndex: 99,
      },
    },
    other: {
      position: "absolute",
      top: "50%",
      left: "0%",
      xPercent: 0,
      yPercent: -40,
      width: "70%",
      height: "auto",
      scale: 1,
      zIndex: 10,
    },
  },
};

// ── Custom hook: scroll direction ────────────────────────────────────────────
const useScrollDirection = (threshold = BREAKPOINTS.scroll_threshold) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > threshold) {
      setIsVisible(currentScrollY <= lastScrollY.current);
    } else {
      setIsVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, [threshold]);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  return isVisible;
};

// ── Animation utilities ──────────────────────────────────────────────────────
const animateHeader = (element: HTMLElement | null, isVisible: boolean) => {
  if (!element) return;
  gsap.to(element, {
    y: isVisible ? 0 : -100,
    opacity: isVisible ? 1 : 0,
    duration: BREAKPOINTS.animation_duration,
    ease: "power2.out",
  });
};

const setupLogoAnimation = (
  logoElement: HTMLElement | null,
  isHomePage: boolean,
) => {
  if (!logoElement) return;

  const mm = gsap.matchMedia();

  mm.add(`(min-width: ${BREAKPOINTS.mobile}px)`, () => {
    if (isHomePage) {
      gsap.set(logoElement, LOGO_CONFIGS.desktop.home.initial);
      gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "+=100",
          scrub: 100,
          onUpdate: (self) => {
            const progress = self.progress;
            const { final } = LOGO_CONFIGS.desktop.home;
            gsap.to(logoElement, {
              scale: gsap.utils.interpolate(1, final.scale, progress),
              yPercent: gsap.utils.interpolate(
                LOGO_CONFIGS.desktop.home.initial.yPercent,
                final.yPercent,
                progress,
              ),
              duration: 0.1,
              ease: "none",
              zIndex: final.zIndex,
            });
          },
        },
      });
    } else {
      gsap.set(logoElement, LOGO_CONFIGS.desktop.other);
    }
  });

  mm.add(`(max-width: ${BREAKPOINTS.mobile - 1}px)`, () => {
    if (isHomePage) {
      const { initial, final } = LOGO_CONFIGS.mobile.home;
      gsap.set(logoElement, initial);
      gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "+=100",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(logoElement, {
              top: gsap.utils.interpolate(initial.top, final.top, progress),
              left: gsap.utils.interpolate(initial.left, final.left, progress),
              xPercent: gsap.utils.interpolate(
                initial.xPercent,
                final.xPercent,
                progress,
              ),
              yPercent: gsap.utils.interpolate(
                initial.yPercent,
                final.yPercent,
                progress,
              ),
              width: gsap.utils.interpolate(
                initial.width as string,
                final.width as string,
                progress,
              ),
              maxWidth: progress > 0.5 ? final.maxWidth : initial.maxWidth,
              scale: gsap.utils.interpolate(
                initial.scale,
                final.scale,
                progress,
              ),
              zIndex: Math.round(
                gsap.utils.interpolate(initial.zIndex, final.zIndex, progress),
              ),
              duration: 0.1,
              ease: "none",
            });
          },
        },
      });
    } else {
      gsap.set(logoElement, LOGO_CONFIGS.mobile.other);
    }
  });

  return mm;
};

// ── Logo sub-component ───────────────────────────────────────────────────────
const Logo = ({
  logoRef,
}: {
  logoRef: React.RefObject<HTMLImageElement | null>;
}) => (
  <Link href="/" className="flex-shrink-0 z-50">
    <Image
      ref={logoRef as React.RefObject<HTMLImageElement>}
      src={logo}
      alt="Banstola Brothers Logo"
      width={200}
      height={60}
      className="h-auto max-w-full px-8 z-50"
      priority
    />
  </Link>
);

// ── Desktop nav sub-component ────────────────────────────────────────────────
const DesktopNav = ({ currentPath }: { currentPath: string }) => {
  const leftNavItems = headerData.slice(0, 3);
  const rightNavItems = headerData.slice(3);

  return (
    <section className="flex w-full max-w-[1440] mx-auto uppercase">
      <nav className="hidden lg:flex items-center w-full justify-start px-1 gap-4">
        {leftNavItems.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className={`transition-colors duration-300 py-4 ${
              currentPath === item.link
                ? "text-brand-100 line-through"
                : "text-white hover:line-through"
            }`}
          >
            <p>{item.title}</p>
          </Link>
        ))}
      </nav>

      <nav className="hidden lg:flex items-center w-full justify-end px-1 gap-4">
        {rightNavItems.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className={`transition-colors duration-300 py-4 ${
              currentPath === item.link
                ? "text-brand-100 line-through"
                : "text-white hover:line-through"
            }`}
          >
            <p>{item.title}</p>
          </Link>
        ))}
        <MyButton type="whatsapp" />
      </nav>
    </section>
  );
};

// ── Main Header component ────────────────────────────────────────────────────
const Header = () => {
  const pathname = usePathname(); // ← replaces useLocation()
  const [isOpen, setIsOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const isNavVisible = useScrollDirection();
  const isHomePage = pathname === "/" || pathname === "/home";

  const handleNavigate = useCallback(() => setIsOpen(false), []);

  const handleLinkClick = (url: string, name: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    console.log(`Clicked on ${name} link`);
  };

  // Logo animation
  useEffect(() => {
    const mm = setupLogoAnimation(logoRef.current, isHomePage);
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      mm?.revert();
    };
  }, [isHomePage]);

  // Header show/hide on scroll
  useEffect(() => {
    animateHeader(headerRef.current, isNavVisible);
  }, [isNavVisible]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-brand-500"
        style={{ minHeight: "100px" }}
        role="banner"
      >
        <div className="mx-4 lg:mx-16">
          <div className="flex items-center justify-between h-24">
            <Logo logoRef={logoRef} />
            <DesktopNav currentPath={pathname} />

            {/* Mobile drawer */}
            <Drawer.Root open={isOpen} onOpenChange={setIsOpen} direction="top">
              <Drawer.Trigger asChild>
                <button
                  className="lg:hidden flex items-center text-white justify-center p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                  aria-label="Open navigation menu"
                >
                  <Menu size={32} />
                </button>
              </Drawer.Trigger>

              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-white/5 z-50 backdrop-blur-3xl" />
                <Drawer.Content className="fixed top-0 bottom-0 left-0 right-0 z-50">
                  <Drawer.Title />
                  <section className="absolute top-2 bottom-2 left-2 right-2 z-50 flex flex-col gap-2">
                    {/* Nav links */}
                    <section className="flex flex-col h-full rounded-[32px] p-8 justify-center items-center gap-4 bg-brand-500">
                      {headerData.map((item) => (
                        <Drawer.Close key={item.id} asChild>
                          <Link
                            href={item.link}
                            className={`block text-center ${
                              pathname === item.link
                                ? "text-brand-100 line-through"
                                : "text-white"
                            }`}
                            onClick={handleNavigate}
                          >
                            <h1 className="text-6xl">{item.title}</h1>
                          </Link>
                        </Drawer.Close>
                      ))}
                    </section>

                    {/* Social links */}
                    <section className="flex flex-col rounded-[32px] text-center items-center justify-center bg-brand-50 p-6 gap-8">
                      <MyButton
                        type="whatsapp"
                        className="flex items-center justify-center w-full gap-2"
                      />

                      <div className="flex flex-wrap items-center justify-center gap-6">
                        {linksData.map((link) => {
                          const IconComponent = link.icon;
                          return (
                            <div
                              key={link.id}
                              onClick={() =>
                                handleLinkClick(link.url, link.name)
                              }
                              className="group cursor-pointer"
                            >
                              <div className="p-4 bg-brand-100 rounded-full flex items-center justify-center">
                                <IconComponent size={24} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-neutral-600">
                        © {new Date().getFullYear()} Banstola Brothers
                      </p>
                    </section>

                    {/* CTA */}
                    <Drawer.Close asChild>
                      <div className="flex flex-col items-center gap-2 justify-end m-4">
                        <MyButton
                          type="secondarybutton"
                          text="Close"
                          className="w-full"
                        />
                      </div>
                    </Drawer.Close>
                  </section>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
