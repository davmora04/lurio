"use server";

import { headers } from "next/headers";
import { defaultContext, processContact } from "@backend/contact/submit";
import type { ContactState } from "@backend/contracts/state";

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  return processContact(formData, defaultContext(await clientKey()));
}
