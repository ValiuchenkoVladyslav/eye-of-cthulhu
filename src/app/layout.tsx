import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
   title: "Eye Of Cthulhu",
};

export default function RootLayout(props: React.PropsWithChildren) {
   return (
      <html lang="en">
         <body className="min-h-screen antialiased">
            <header className="sticky top-0 flex gap-2">
               <Link href="/">home</Link>
            </header>

            <main>{props.children}</main>
         </body>
      </html>
   );
}
