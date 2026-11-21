const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const { createMemoryStore } = require("./repositories/memoryStore");

function createApp({ store = createMemoryStore() } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: false, limit: "10kb" }));
  app.get("/api/health", (_req, res) => res.json({ ok: true, status: "up", userCount: store.countUsers() }));
  app.use("/api", authRoutes({ store }));
  app.use("/api", userRoutes({ store }));
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && "body" in err) return res.status(400).json({ ok: false, error: "Invalid JSON body" });
    console.error(err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  });
  return app;
}

module.exports = { createApp };
