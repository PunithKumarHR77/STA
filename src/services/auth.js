function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function readBearerToken(req) {
  const match = /^Bearer\s+(.+)$/i.exec(req.get("authorization") || "");
  return match ? match[1].trim() : "";
}

module.exports = { normalizeEmail, readBearerToken };
