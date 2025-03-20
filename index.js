const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const PaymentRoute = require("./route/mpesaPaymentRoute");

app.get("/", (req, res) => {
	res.send("Welcome to Mpesa Payment API");
});

app.use("/payment_with_mpesa", PaymentRoute);
app.listen(PORT, () => {
	console.log(`Serving running on port ${8080}`);
});
