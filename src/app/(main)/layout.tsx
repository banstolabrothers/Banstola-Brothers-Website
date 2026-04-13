import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ClientWrapper } from "@/components/transition/ClientWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientWrapper>
        <Header />
        <main>{children}</main>
        <Footer />
      </ClientWrapper>
    </>
  );
}
