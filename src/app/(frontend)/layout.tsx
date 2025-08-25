import React from "react";

export const metadata = {
  description: "Daniel's personal website",
  title: "Daniel Guan",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
