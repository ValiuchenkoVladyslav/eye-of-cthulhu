import { Suspense } from "react";
import { getMembers } from "./actions";
import { Members } from "./members";

export default function TeamPage() {
   return (
      <div className="w-full">
         <h1>Members</h1>

         <Suspense fallback={<p>loading...</p>}>
            <Members members={getMembers()} />
         </Suspense>
      </div>
   );
}
