/**
 * Admin Seeder
 * Crea el primer usuario administrador leyendo las credenciales del archivo .env.
 *
 * Uso:
 *   npm run create-admin
 *
 * Variables requeridas en .env:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME
 *
 * Variables opcionales en .env:
 *   ADMIN_PHONE
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { conn, User } = require("../db");

const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  ADMIN_PHONE,
} = process.env;

async function createAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_FIRST_NAME || !ADMIN_LAST_NAME) {
    console.error(
      "❌  Faltan variables de entorno para crear el admin.\n" +
      "    Asegurate de tener en tu .env:\n" +
      "    ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME"
    );
    process.exit(1);
  }

  try {
    await conn.authenticate();
    await conn.sync({ alter: false });

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });

    if (existing) {
      if (existing.role === "admin") {
        console.log(`ℹ️  Ya existe un admin con el email: ${ADMIN_EMAIL}`);
      } else {
        existing.role = "admin";
        await existing.save();
        console.log(`✅  Usuario ${ADMIN_EMAIL} actualizado a rol admin.`);
      }
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      email: ADMIN_EMAIL,
      password: password_hash,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      phone: ADMIN_PHONE || null,
      role: "admin",
      active: true,
    });

    console.log(`✅  Admin creado exitosamente.`);
    console.log(`    Email: ${ADMIN_EMAIL}`);
    console.log(`    Nombre: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    process.exit(0);
  } catch (error) {
    console.error("❌  Error al crear el admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
