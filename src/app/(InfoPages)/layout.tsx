import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface">{children}</main>
      <Footer />
    </div>
  );
}
