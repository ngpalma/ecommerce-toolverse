const { Router } = require("express");
const {
  getAllProducts,
  getProductById,
  getProductByName,
  createProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/Product.controller");
const { adminRequired } = require("../middlewares/validateToken");

const router = Router();

// Lectura — pública
router.get("/products", (req, res) => {
  if (req.query.name) getProductByName(req, res);
  else getAllProducts(req, res);
});
router.get("/products/:id", getProductById);

// Escritura — solo admin
router.post("/products", adminRequired, createProducts);
router.put("/products/:id", adminRequired, updateProduct);
router.delete("/products/:id", adminRequired, deleteProduct);

module.exports = router;
