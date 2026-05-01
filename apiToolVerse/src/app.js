require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const routes = require("./routes/index.js");

require("./db.js");

const server = express();
server.name = "API";

server.use(helmet());
server.use(morgan("dev"));

server.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);

server.use(cookieParser());
server.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiados intentos. Intentá de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});
server.use("/login", authLimiter);
server.use("/register", authLimiter);

server.use(routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  console.error(err);
  res.status(status).json({ message });
});

module.exports = server;
