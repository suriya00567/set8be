const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const SECRET = "mysecret";

// 🔹 Login (returns token)
app.post("/login", (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// 🔹 Middleware
function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("No token");

  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// 🔹 Protected API
app.get("/data", auth, (req, res) => {
  res.json({ message: "Protected Data", user: req.user.email });
});

app.listen(3000, () => console.log("Backend running"));