import { hex, object, string } from "zod/v4";

export { prettifyError } from "zod/v4";

export const signUpDto = object({
   username: string().min(3).max(14),
   password: string().min(8).max(120),
   invite: hex(),
});

export const signInDto = signUpDto.omit({ invite: true });
