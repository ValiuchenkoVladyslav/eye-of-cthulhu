"use client";

import { use } from "react";
import type { getMembers } from "./actions";

export function Members(props: { members: ReturnType<typeof getMembers> }) {
   const res = use(props.members);

   return (
      <ul className="flex flex-col gap-2">
         {res.map((user) => (
            <li key={user.id}>{user.username}</li>
         ))}
      </ul>
   );
}
