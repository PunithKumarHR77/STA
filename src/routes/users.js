const express = require("express");
const { readBearerToken } = require("../services/auth");

module.exports = ({ store }) => {
  const router = express.Router();
  router.get("/users", (_req, res) => {
    const users = store.listUsers();
    return res.json({ ok: true, count: users.length, users });
  });
  router.get("/me", (req, res) => {
    const email = store.findSession(readBearerToken(req));
    const user = email && store.findUser(email);
    if (!user) return res.status(401).json({ ok: false, error: "Not authenticated" });
    return res.json({ ok: true, email: user.email, name: user.name });
  });
  return router;
};
