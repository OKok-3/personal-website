import AnimationWrapper from "@/components/AnimationWrapper/AnimationWrapper";
import "./globals.css";
import Header from "@/components/Header/page";
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
        <AnimationWrapper>
          <Header />
          <main>
            {children}
          </main>
          <SocialsContainer />
        </AnimationWrapper>
      </body>
    </html>
  );
}
