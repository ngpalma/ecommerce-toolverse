const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
} = require("../controllers/User.controller");
const { authRequired, adminRequired } = require("../middlewares/validateToken");

const router = Router();

// Gestión de usuarios — solo admin (excepto ver el propio perfil)
router.get("/user", adminRequired, getAllUsers);
router.get("/user/name", adminRequired, getUserByName);
router.get("/user/:id", authRequired, getUserById);
router.put("/user/:id", authRequired, updateUser);
router.delete("/user/:id", adminRequired, deleteUser);

module.exports = router;
