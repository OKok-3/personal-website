import "./globals.css";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import SocialsContainer from "@/components/socialsContainer/page";

export const metadata = {
  title: 'Daniel Guan',
  description: 'Daniel\'s personal website',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <SocialsContainer />
        <Footer />
        <div className="overlay">
          <p>Sorry, your device is too small to view this website. Please zoom out, rotate your device, or use a computer for a better experience.</p>
        </div>
      </body>
    </html>
  );
}
