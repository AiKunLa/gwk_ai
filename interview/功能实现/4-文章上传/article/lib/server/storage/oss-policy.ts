import { MAX_IMAGE_SIZE_BYTES } from "@/lib/domain/image-policy";

const UPLOAD_POLICY_TTL_MS = 2 * 60 * 1_000;
const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const PENDING_OBJECT_ACL = "private";
const FORBID_OVERWRITE = "true";

export interface OssPolicyConfig {
  region: string;
  bucket: string;
  endpoint?: string;
  publicBaseUrl: string;
  stsToken: string | null;
}

interface PostSignature {
  OSSAccessKeyId: string;
  Signature: string;
  policy: string;
}

type CalculatePostSignature = (policy: object) => PostSignature;

export interface PostObjectUpload {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
  fields: Record<string, string>;
}

export function createPostObjectUpload(input: {
  config: OssPolicyConfig;
  objectKey: string;
  contentType: string;
  now: Date;
  calculatePostSignature: CalculatePostSignature;
}): PostObjectUpload {
  const expiresAt = new Date(input.now.getTime() + UPLOAD_POLICY_TTL_MS).toISOString();
  const conditions: unknown[] = [
    { bucket: input.config.bucket },
    ["eq", "$key", input.objectKey],
    ["eq", "$Content-Type", input.contentType],
    ["eq", "$Cache-Control", IMMUTABLE_CACHE_CONTROL],
    ["eq", "$x-oss-object-acl", PENDING_OBJECT_ACL],
    ["eq", "$x-oss-forbid-overwrite", FORBID_OVERWRITE],
    ["content-length-range", 1, MAX_IMAGE_SIZE_BYTES],
    ["eq", "$success_action_status", "200"],
  ];

  if (input.config.stsToken) {
    conditions.push({ "x-oss-security-token": input.config.stsToken });
  }

  const signature = input.calculatePostSignature({
    expiration: expiresAt,
    conditions,
  });
  const fields: Record<string, string> = {
    key: input.objectKey,
    OSSAccessKeyId: signature.OSSAccessKeyId,
    Signature: signature.Signature,
    policy: signature.policy,
    success_action_status: "200",
    "Content-Type": input.contentType,
    "Cache-Control": IMMUTABLE_CACHE_CONTROL,
    "x-oss-object-acl": PENDING_OBJECT_ACL,
    "x-oss-forbid-overwrite": FORBID_OVERWRITE,
  };

  if (input.config.stsToken) {
    fields["x-oss-security-token"] = input.config.stsToken;
  }

  return {
    uploadUrl: getUploadUrl(input.config),
    publicUrl: joinPublicUrl(input.config.publicBaseUrl, input.objectKey),
    expiresAt,
    fields,
  };
}

function getUploadUrl(config: OssPolicyConfig): string {
  if (config.endpoint) return config.endpoint.replace(/\/+$/, "");
  return `https://${config.bucket}.${config.region}.aliyuncs.com`;
}

function joinPublicUrl(baseUrl: string, objectKey: string): string {
  const encodedKey = objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl.replace(/\/+$/, "")}/${encodedKey}`;
}
