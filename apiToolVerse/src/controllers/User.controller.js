const { User, PurchaseCart, PurchaseOrder, ShippingAddress, Review } = require("../db");
const { Op } = require("sequelize");

const INCLUDE_USER_RELATIONS = [
  { model: PurchaseCart, required: false },
  { model: PurchaseOrder, required: false },
  { model: ShippingAddress, required: false },
  { model: Review, required: false },
];

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: INCLUDE_USER_RELATIONS });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id }, include: INCLUDE_USER_RELATIONS });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByName = async (req, res) => {
  try {
    const { firstName } = req.query;
    const users = await User.findAll({
      where: { firstName: { [Op.iLike]: `%${firstName}%` } },
      include: INCLUDE_USER_RELATIONS,
    });
    if (!users.length) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    await user.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, getUserByName, updateUser, deleteUser };
