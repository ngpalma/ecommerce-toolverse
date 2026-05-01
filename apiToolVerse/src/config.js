require("dotenv").config();

// Acepta TOKEN_SECRET (nombre nuevo) o SECRET_SESSION (compatibilidad con .env existente)
const TOKEN_SECRET = process.env.TOKEN_SECRET || process.env.SECRET_SESSION;

if (!TOKEN_SECRET) {
  throw new Error(
    "Falta TOKEN_SECRET en el archivo .env. Agregá la variable y reiniciá el servidor."
  );
}

module.exports = {
  TOKEN_SECRET,
};
