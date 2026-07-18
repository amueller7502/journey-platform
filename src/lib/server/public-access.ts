import { timingSafeEqual } from "node:crypto";
import { getRequestAuthContext, requestUserCanAccess } from "@/lib/server/request-auth";

export const MANAGER_LINK_HEADER = "x-experience-manager-key";
export const LOCAL_MANAGER_LINK_KEY = "local-preview";

function safelyMatches(candidate: string, expected: string) {
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export function managerLinkKeyIsValid(candidate: string | null | undefined) {
  if (!candidate) {
    return false;
  }

  const configuredKey = process.env.EXPERIENCE_MANAGER_LINK_KEY?.trim();
  if (configuredKey) {
    return configuredKey.length >= 24 && safelyMatches(candidate, configuredKey);
  }

  return process.env.NODE_ENV !== "production" && candidate === LOCAL_MANAGER_LINK_KEY;
}

export function managerLinkIsConfigured() {
  return Boolean(process.env.EXPERIENCE_MANAGER_LINK_KEY?.trim());
}

export async function requestCanSubmitExperience(request: Request) {
  if (managerLinkKeyIsValid(request.headers.get(MANAGER_LINK_HEADER))) {
    return true;
  }

  const context = await getRequestAuthContext(request);
  return requestUserCanAccess(context, "manager");
}
