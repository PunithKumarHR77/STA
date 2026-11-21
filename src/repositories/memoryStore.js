const crypto = require("crypto");

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

function createMemoryStore({ seedDemoUser = process.env.NODE_ENV !== "production" } = {}) {
  const users = new Map();
  const sessions = new Map();
  if (seedDemoUser) {
    users.set("test@example.com", { email: "test@example.com", passwordHash: hashPassword("Test@1234"), name: "Test User" });
  }
  return {
    findUser: (email) => users.get(email),
    createUser({ email, password, name }) {
      const user = { email, passwordHash: hashPassword(password), name };
      users.set(email, user);
      return user;
    },
    listUsers: () => Array.from(users.values(), ({ email, name }) => ({ email, name })),
    countUsers: () => users.size,
    createSession(email) {
      const token = crypto.randomBytes(32).toString("hex");
      sessions.set(token, email);
      return token;
    },
    findSession: (token) => sessions.get(token),
    deleteSession: (token) => sessions.delete(token),
    verifyPassword(user, password) {
      const candidate = Buffer.from(hashPassword(password));
      const expected = Buffer.from(user.passwordHash);
      return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
    },
  };
}

module.exports = { createMemoryStore };
