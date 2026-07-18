import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getRequestAuthContext, requestUserCanAccess } from "@/lib/server/request-auth";

export const MANAGER_LINK_HEADER = "x-experience-manager-key";
export const LOCAL_MANAGER_LINK_KEY = "local-preview";
const MANAGER_CREDENTIAL_VERSION = "v1";
const MANAGER_CREDENTIAL_LIFETIME_SECONDS = 12 * 60 * 60;

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

function configuredManagerSecret() {
  const secret = process.env.EXPERIENCE_MANAGER_LINK_KEY?.trim();
  return secret && secret.length >= 24 ? secret : undefined;
}

function managerCredentialSignature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createManagerSubmissionCredential() {
  const secret = configuredManagerSecret();
  if (!secret) {
    return process.env.NODE_ENV !== "production" ? LOCAL_MANAGER_LINK_KEY : undefined;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + MANAGER_CREDENTIAL_LIFETIME_SECONDS;
  const payload = `${MANAGER_CREDENTIAL_VERSION}.${expiresAt}.${randomBytes(12).toString("base64url")}`;
  return `${payload}.${managerCredentialSignature(payload, secret)}`;
}

export function managerSubmissionCredentialIsValid(
  candidate: string | null | undefined,
) {
  if (managerLinkKeyIsValid(candidate)) {
    return true;
  }

  const secret = configuredManagerSecret();
  if (!candidate || !secret) {
    return false;
  }

  const [version, expiresAtRaw, nonce, signature, ...extra] = candidate.split(".");
  if (
    extra.length ||
    version !== MANAGER_CREDENTIAL_VERSION ||
    !expiresAtRaw ||
    !nonce ||
    !signature
  ) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${version}.${expiresAtRaw}.${nonce}`;
  return safelyMatches(signature, managerCredentialSignature(payload, secret));
}

export async function requestCanSubmitExperience(request: Request) {
  if (managerSubmissionCredentialIsValid(request.headers.get(MANAGER_LINK_HEADER))) {
    return true;
  }

  const context = await getRequestAuthContext(request);
  return requestUserCanAccess(context, "manager");
}
