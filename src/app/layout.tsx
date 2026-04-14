import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
   title: "Eye Of Cthulhu",
};

export default function RootLayout(props: React.PropsWithChildren) {
   return (
      <html lang="en">
         <body className="min-h-screen antialiased">{props.children}</body>
      </html>
   );
}
