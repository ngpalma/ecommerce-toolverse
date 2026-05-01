const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.PROD_ACCESS_TOKEN,
});

const createPayment = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    const preference = await new Preference(client).create({
      body: {
        items: items.map((e) => ({
          title: e.name,
          unit_price: Number(e.price),
          quantity: Number(e.quantity),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${clientUrl}/feedback`,
          failure: `${clientUrl}/home`,
          pending: `${clientUrl}/home`,
        },
        // auto_return solo funciona con URLs HTTPS en producción, no con localhost
        ...(clientUrl.startsWith("https") && { auto_return: "approved" }),
      },
    });

    res.status(200).json({ response: preference });
  } catch (error) {
    // Loguea el detalle completo del error de MP para poder diagnosticarlo
    console.error("Error al crear preferencia de MercadoPago:");
    console.error("Status:", error?.status);
    console.error("Cause:", JSON.stringify(error?.cause, null, 2));
    console.error("Message:", error?.message);

    res.status(500).json({
      message: "Error al procesar el pago con Mercado Pago",
      detail: error?.cause ?? error?.message,
    });
  }
};

const feedbackPayment = (req, res) => {
  res.json({
    payment: req.query.payment_id,
    status: req.query.status,
    merchantOrder: req.query.merchant_order_id,
  });
};

module.exports = { createPayment, feedbackPayment };
