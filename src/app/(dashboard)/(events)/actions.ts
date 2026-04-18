"use server";

import { userAuth } from "~/auth";
import {
   type EventBucketSize,
   selectEventBuckets,
   selectIncidents,
} from "~/db/ch";

export async function getRecentIncidents() {
   await userAuth();

   return selectIncidents();
}

export async function getEventBuckets(bucketSize: EventBucketSize) {
   await userAuth();

   return selectEventBuckets(bucketSize);
}
