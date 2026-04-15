import { Suspense } from "react";

async function EventList() {
   const events = await Promise.resolve([
      {
         id: "ID",
         timestamp: new Date(),
      },
   ]);

   return (
      <div className="flex flex-col gap-2">
         {events.map((event) => (
            <div key={event.id}>{event.timestamp.toISOString()}</div>
         ))}
      </div>
   );
}

export default function Home() {
   return (
      <div>
         <h1>activity events</h1>

         <Suspense fallback={<p>loading...</p>}>
            <EventList />
         </Suspense>
      </div>
   );
}
