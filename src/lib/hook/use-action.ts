import "client-only";

import { startTransition, useActionState } from "react";

export function useAction<State>(
   action: (state: State | null, payload: FormData) => Promise<State>,
) {
   const [res, send, pending] = useActionState(action, null);

   function submit(evt: React.SubmitEvent<HTMLFormElement>) {
      evt.preventDefault();

      startTransition(() => send(new FormData(evt.currentTarget)));
   }

   return [submit, res, pending] as const;
}
