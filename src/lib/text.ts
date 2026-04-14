const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const Text = {
   encode(str: string) {
      return encoder.encode(str);
   },
   decode(data: Uint8Array) {
      return decoder.decode(data);
   },
};
