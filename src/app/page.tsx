import { rpc } from "~/lib/rpc";

export const dynamic = "force-dynamic";

export default async function Home() {
   const planets = await rpc.planet.list({
      limit: 10,
      cursor: 0,
   });

   return (
      <div className="flex flex-col gap-2">
         {planets.map((planet) => (
            <div key={planet.id}>{planet.name}</div>
         ))}
      </div>
   );
}
