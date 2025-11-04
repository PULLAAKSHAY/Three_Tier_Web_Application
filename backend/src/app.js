const express = require("express");
const bodyParser = require("body-parser");
const { client } = require("./metrics");
const items = require("./routes/items");

const app = express();
app.use(bodyParser.json());
app.use("/api/items", items);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Backend listening on ${port}`)
);

module.exports = { app, server }; // ✅ export both
