const { Product } = require("../db");
const { Op } = require("sequelize");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

const getProductByName = async (req, res) => {
  const { name } = req.query;
  try {
    const searchValues = name.split(" ");
    const whereClause = searchValues.map((value) => ({
      [Op.or]: [
        { name: { [Op.iLike]: `%${value}%` } },
        { brand: { [Op.iLike]: `%${value}%` } },
      ],
    }));
    const products = await Product.findAll({ where: { [Op.and]: whereClause } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
};

const createProducts = async (req, res) => {
  try {
    const data = req.body;
    if (!data || (Array.isArray(data) && data.length === 0))
      return res.status(400).json({ error: "No se proporcionaron datos" });

    if (Array.isArray(data)) {
      const created = await Product.bulkCreate(data, { validate: true });
      return res.status(201).json(created);
    }

    const created = await Product.create(data);
    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto(s)" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    await product.update(req.body);
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    await product.destroy();
    return res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  createProducts,
  updateProduct,
  deleteProduct,
};
