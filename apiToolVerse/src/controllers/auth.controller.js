const { User } = require("../db");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../libs/jwt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");
const { transport } = require("../utils/correo");

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

const register = async (req, res) => {
  const { email, password, firstName, lastName, phone, address, city } = req.body;
  try {
    const userFound = await User.findOne({ where: { email } });
    if (userFound)
      return res.status(400).json({ message: "El email ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: password_hash,
      firstName,
      lastName,
      role: "client",
      phone: phone || null,
      address: address || null,
      city: city || null,
    });

    const token = await createAccessToken({ id: user.id, role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    const contentHtml = `
      <h1>Bienvenido a Toolverse</h1>
      <p>Tu cuenta fue registrada con el correo: <strong>${email}</strong></p>
    `;
    await transport.sendMail({
      from: process.env.EMAIL_FROM || "Toolverse <noreply@toolverse.com>",
      to: email,
      subject: "Bienvenido a Toolverse",
      html: contentHtml,
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ where: { email } });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    if (!userFound.password)
      return res.status(400).json({ message: "Esta cuenta usa Google OAuth. Ingresá con Google." });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound.id, role: userFound.role });
    res.cookie("token", token, COOKIE_OPTIONS);

    res.json({
      id: userFound.id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
      phone: userFound.phone,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res.sendStatus(200);
};

const profile = async (req, res) => {
  const userFound = await User.findByPk(req.user.id);
  if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });
  return res.json({
    id: userFound.id,
    email: userFound.email,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    role: userFound.role,
  });
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No autorizado" });
    const userFound = await User.findByPk(user.id);
    if (!userFound) return res.status(401).json({ message: "No autorizado" });
    return res.json({
      id: userFound.id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
    });
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userFound = await User.findOne({ where: { email } });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const token = jwt.sign({ id: userFound.id }, TOKEN_SECRET, { expiresIn: "1h" });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetLink = `${clientUrl}/password/${token}`;

    await transport.sendMail({
      from: process.env.EMAIL_FROM || "Toolverse <noreply@toolverse.com>",
      to: email,
      subject: "Restablecer contraseña — Toolverse",
      html: `
        <h1>Restablecer contraseña</h1>
        <p>Hacé clic en el siguiente enlace para restablecer tu contraseña (válido 1 hora):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Enlace de recuperación enviado a tu email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const userFound = await User.findByPk(decodedToken.id);
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    userFound.password = await bcrypt.hash(password, 10);
    await userFound.save();
    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    await transport.sendMail({
      from: process.env.EMAIL_FROM || "Toolverse <noreply@toolverse.com>",
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Contacto: ${subject}`,
      html: `<p><strong>Nombre:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  profile,
  verifyToken,
  forgotPassword,
  resetPassword,
  contactUs,
};
