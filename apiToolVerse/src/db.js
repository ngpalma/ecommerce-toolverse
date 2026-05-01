require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  PaymentMethod,
  Product,
  PurchaseCart,
  PurchaseDetail,
  PurchaseOrder,
  ShippingAddress,
  User,
  Review,
  Task,
  StockMovement,
  Category,
} = sequelize.models;

User.hasMany(PurchaseCart);
PurchaseCart.belongsTo(User);

User.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(User);

User.hasMany(ShippingAddress);
ShippingAddress.belongsTo(User);

ShippingAddress.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(ShippingAddress);

PaymentMethod.hasMany(PurchaseOrder);
PurchaseOrder.belongsTo(PaymentMethod);

PurchaseCart.hasMany(PurchaseDetail);
PurchaseDetail.belongsTo(PurchaseCart);

Product.hasMany(PurchaseDetail);
PurchaseDetail.belongsTo(Product);

User.hasMany(Review);
Review.belongsTo(User);

Product.hasMany(Review);
Review.belongsTo(Product);

PurchaseCart.hasOne(PurchaseOrder);
PurchaseOrder.belongsTo(PurchaseCart);

User.hasMany(Task);
Task.belongsTo(User);

Product.hasMany(StockMovement);
StockMovement.belongsTo(Product);

Product.hasMany(Category);
Category.belongsTo(Product);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
