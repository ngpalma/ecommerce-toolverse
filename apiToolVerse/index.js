const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const {
  loadPaymentMethods,
} = require("./src/controllers/PaymentMethod.controller.js");
const port = process.env.PORT || 3001;

conn.sync({ alter: true }).then(async () => {
  await loadPaymentMethods();
  server.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
  });
});
