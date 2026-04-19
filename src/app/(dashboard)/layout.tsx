import { NavLink } from "~/component/nav-link";

export default function DashboardLayout(props: React.PropsWithChildren) {
   return (
      <>
         <aside className="w-40 flex flex-col gap-2 p-2 text-lg border-r-1 border-r-white/15">
            <NavLink
               href="/"
               className="aria-[current=page]:bg-sc p-2 duration-200 font-semibold rounded-lg"
            >
               Events
            </NavLink>
            <NavLink
               href="/services"
               className="aria-[current=page]:bg-sc p-2 duration-200 font-semibold rounded-lg"
            >
               Services
            </NavLink>
            <NavLink
               href="/team"
               className="aria-[current=page]:bg-sc p-2 duration-200 font-semibold rounded-lg"
            >
               Team
            </NavLink>
         </aside>

         <main className="flex-1 max-h-screen overflow-y-scroll flex p-2">
            {props.children}
         </main>
      </>
   );
}
