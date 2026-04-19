import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import PageTransition from "@/components/transition/PageTransition";
import { TransitionProvider } from "@/components/transition/TransitionContext";
import LenisProvider from "@/components/ui/LenisProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // TransitionProvider must be outermost — LenisProvider reads from it
    <TransitionProvider>
      <LenisProvider>
        <Header />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </LenisProvider>
    </TransitionProvider>
  );
}
