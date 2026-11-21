const express = require("express");
const { normalizeEmail, readBearerToken } = require("../services/auth");

module.exports = ({ store }) => {
  const router = express.Router();
  router.post("/signup", (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!name || !email || !password) return res.status(400).json({ ok: false, error: "name, email and password are required" });
    if (name.length > 100 || email.length > 254 || password.length < 8 || password.length > 200) {
      return res.status(400).json({ ok: false, error: "Name/email is too long or password must be 8-200 characters" });
    }
    if (store.findUser(email)) return res.status(409).json({ ok: false, error: "User already exists" });
    store.createUser({ name, email, password });
    return res.status(201).json({ ok: true, message: "Signup successful" });
  });
  router.post("/login", (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const user = store.findUser(email);
    if (!user || !store.verifyPassword(user, password)) return res.status(401).json({ ok: false, error: "Invalid email or password" });
    return res.json({ ok: true, token: store.createSession(email), name: user.name });
  });
  router.post("/logout", (req, res) => {
    const token = readBearerToken(req);
    if (token) store.deleteSession(token);
    return res.json({ ok: true });
  });
  return router;
};
