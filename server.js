const { createApp } = require("./src/app");

const port = Number.parseInt(process.env.PORT || "3000", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const server = createApp().listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Seeded login -> email: test@example.com | password: Test@1234");
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
