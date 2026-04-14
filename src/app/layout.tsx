import type { Metadata } from "next";

// https://orpc.dev/docs/adapters/next
import "~/setup-server-rpc";

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
