import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chinghua Ivy Lu website",
  description: "Hello! I'm currently a student at National Taiwan University. I have a deep love for traveling and observing the world around me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
