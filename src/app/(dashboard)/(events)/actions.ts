"use server";

import { userAuth } from "~/auth";
import {
   type EventBucketSize,
   selectEventBuckets,
   selectIncidents,
   selectProcessLogs,
} from "~/db/ch";

export async function getRecentIncidents() {
   await userAuth();

   return selectIncidents();
}

export async function getEventBuckets(
   bucketSize: EventBucketSize,
   offset?: string,
) {
   await userAuth();

   return selectEventBuckets(bucketSize, offset);
}

export async function getProcessLogs(process: string) {
   await userAuth();

   return selectProcessLogs(process);
}
