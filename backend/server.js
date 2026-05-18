const express = require("express");
const app = express();
const { PORT } = require("./config/env");

app.use(express.json());

app.get("/", (req, res) => res.send("FieldSync backend running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
