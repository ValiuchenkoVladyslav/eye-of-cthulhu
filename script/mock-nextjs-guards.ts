//! it's fucking dumb. tweaking compiler options may break nextjs,
//! separate tsconfig isn't working in bun for some reason

import { mock } from "bun:test";

mock.module("server-only", () => ({}));
mock.module("client-only", () => ({}));
