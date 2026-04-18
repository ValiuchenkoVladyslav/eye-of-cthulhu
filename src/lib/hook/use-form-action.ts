import "client-only";

import { useState } from "react";

export interface FormActionData {
   [k: string]: FormDataEntryValue;
}

export function useFormAction<State>(
   action: (payload: FormActionData) => Promise<State>,
) {
   const [res, setRes] = useState<State>();

   async function submit(evt: React.SubmitEvent<HTMLFormElement>) {
      evt.preventDefault();

      const data = Object.fromEntries(new FormData(evt.currentTarget));

      setRes(await action(data));
   }

   return [submit, res] as const;
}
