import { NavLink } from "~/component/nav-link";

export default function DashboardLayout(props: React.PropsWithChildren) {
   return (
      <>
         <header className="sticky top-0 flex gap-2">
            <NavLink href="/">home</NavLink>
         </header>

         <main className="flex-1 flex">{props.children}</main>
      </>
   );
}
