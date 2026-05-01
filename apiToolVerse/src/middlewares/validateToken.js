const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");

const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "No autorizado: token requerido" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};

const adminRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "No autorizado: token requerido" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Acceso denegado: se requiere rol de administrador" });
    req.user = user;
    next();
  });
};

module.exports = {
  authRequired,
  adminRequired,
};
