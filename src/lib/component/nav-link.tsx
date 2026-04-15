"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, ...props }: React.ComponentProps<typeof Link>) {
   const pathname = usePathname();

   const hrefStr = typeof href === "string" ? href : (href.pathname ?? "");

   return (
      <Link
         href={href}
         aria-current={pathname.startsWith(hrefStr) && "page"}
         {...props}
      />
   );
}
