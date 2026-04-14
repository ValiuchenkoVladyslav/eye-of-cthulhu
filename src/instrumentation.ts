export async function register() {
   // https://orpc.dev/docs/adapters/next
   if (typeof window === "undefined") {
      await import("./setup-server-rpc");
   }
}
