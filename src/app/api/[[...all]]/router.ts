import { os, type RouterClient } from "@orpc/server";

import z from "zod/v4";

const PlanetSchema = z.object({
   id: z.number().int().min(1),
   name: z.string(),
   description: z.string().optional(),
});

export const listPlanet = os
   .input(
      z.object({
         limit: z.number().int().min(1).max(100).optional(),
         cursor: z.number().int().min(0).default(0),
      }),
   )
   .handler(async ({ input }) => {
      return [
         { id: 1, name: "earth" },
         { id: 2, name: Math.random() },
      ];
   });

export const findPlanet = os
   .input(PlanetSchema.pick({ id: true }))
   .handler(async ({ input }) => {
      return { id: 1, name: "earth" };
   });

export const router = {
   planet: {
      list: listPlanet,
      find: findPlanet,
   },
};

export type Router = RouterClient<typeof router>;
