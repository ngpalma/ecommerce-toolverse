const { PurchaseCart } = require("../db");

const getAllPurchaseCart = async (req, res) => {
  try {
    const carts = await PurchaseCart.findAll();
    return res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPurchaseCartId = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await PurchaseCart.findByPk(id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPurchaseCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await PurchaseCart.create({ userId });
    return res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePurchaseCart = async (req, res) => {
  try {
    const cart = await PurchaseCart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    await cart.destroy();
    return res.status(200).json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
};

const updatePurchaseCart = async (req, res) => {
  try {
    const cart = await PurchaseCart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    await cart.update(req.body);
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
};

module.exports = {
  getAllPurchaseCart,
  getPurchaseCartId,
  createPurchaseCart,
  deletePurchaseCart,
  updatePurchaseCart,
};
