const allowedFolders = new Set([
  "site-logos",
  "agent-photos",
  "property-images",
  "property-videos",
]);

const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanFilename(filename) {
  return filename
    .normalize("NFKC")
    .replace(/[/\\]/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

export async function onRequestPost({ request, env }) {
  if (!env.MEDIA_BUCKET || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.R2_PUBLIC_BASE_URL) {
    return jsonResponse({ error: "R2 media uploads are not configured for this deployment." }, 503);
  }

  const authorization = request.headers.get("Authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!tokenMatch) {
    return jsonResponse({ error: "Sign in as an administrator to upload media." }, 401);
  }

  let user;
  try {
    const userResponse = await fetch(`${env.SUPABASE_URL.replace(/\/+$/, "")}/auth/v1/user`, {
      headers: {
        apikey: env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${tokenMatch[1]}`,
      },
    });
    if (!userResponse.ok) {
      return jsonResponse({ error: "Your session is invalid or expired. Sign in again." }, 401);
    }
    user = await userResponse.json();
  } catch (error) {
    console.error("Could not verify the media uploader with Supabase:", error);
    return jsonResponse({ error: "Could not verify your admin session. Try again." }, 502);
  }

  if (user.app_metadata?.role !== "admin") {
    return jsonResponse({ error: "Only administrators can upload media." }, 403);
  }

  const uploadUrl = new URL(request.url);
  const folder = uploadUrl.searchParams.get("folder") || "";
  const filename = cleanFilename(uploadUrl.searchParams.get("filename") || "");
  const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();

  if (!allowedFolders.has(folder)) {
    return jsonResponse({ error: "This media folder is not allowed." }, 400);
  }
  if (!filename || filename === "." || filename === "..") {
    return jsonResponse({ error: "A valid filename is required." }, 400);
  }
  if (!allowedContentTypes.has(contentType)) {
    return jsonResponse({ error: "This image or video type is not allowed." }, 415);
  }
  if (!request.body) {
    return jsonResponse({ error: "The uploaded file is empty." }, 400);
  }
  if (request.headers.get("Content-Length") === "0") {
    return jsonResponse({ error: "The uploaded file is empty." }, 400);
  }

  const key = `${folder}/${crypto.randomUUID()}-${filename}`;
  try {
    await env.MEDIA_BUCKET.put(key, request.body, {
      httpMetadata: { contentType },
    });
  } catch (error) {
    console.error("Could not store media in R2:", error);
    return jsonResponse({ error: "Could not store the file in R2. Try again." }, 502);
  }

  const publicBaseUrl = env.R2_PUBLIC_BASE_URL.replace(/\/+$/, "");
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return jsonResponse({ url: `${publicBaseUrl}/${encodedKey}` }, 201);
}
