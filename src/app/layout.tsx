import "./globals.css";
import { AnimationContextProvider } from "@/contexts/AnimationContext";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import SocialsContainer from "@/components/SocialsContainer/page";

export const metadata = {
  title: 'Daniel Guan',
  description: 'Daniel\'s personal website'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnimationContextProvider>
          <Header />
          <main>{children}</main>
          <SocialsContainer />
          <Footer />
        </AnimationContextProvider>
      </body>
    </html>
  );
}
