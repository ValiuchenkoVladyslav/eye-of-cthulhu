import { permanentRedirect } from "next/navigation";

export default function Unauthorized() {
   permanentRedirect("/sign-in");
}
