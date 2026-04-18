import { NavLink } from "~/component/nav-link";

export default function AuthLayout(props: React.PropsWithChildren) {
   return (
      <div className="mx-auto mt-64 h-fit bg-black/90 text-white w-86 rounded-xl">
         <nav className="flex gap-2 p-3 font-semibold">
            <NavLink
               href="/sign-in"
               className="duration-200 aria-[current=page]:bg-white/15 rounded-lg p-2 flex-1 text-center"
            >
               Sign In
            </NavLink>

            <NavLink
               href="/sign-up"
               className="duration-200 aria-[current=page]:bg-white/15 rounded-lg p-2 flex-1 text-center"
            >
               Sign Up
            </NavLink>
         </nav>

         <div className="p-3 pt-0">{props.children}</div>
      </div>
   );
}
