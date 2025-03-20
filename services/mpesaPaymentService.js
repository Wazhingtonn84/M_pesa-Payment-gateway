const Axios = require("axios");

const createTokenService = async (req, res) => {
	try {
		const consumerKey = process.env.CONSUMER_KEY;
		const secret = process.env.CONSUMER_SECRET;

		const auth = new Buffer.from(`${consumerKey}:${secret}`).toString("base64");

		const data = await Axios({
			url: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
			method: "GET",
			headers: {
				Authorization: `Basic ${auth}`,
			},
		});

		token = data.data.access_token;
		return token;
	} catch (error) {
		console.error("Token Generation Error:", error.message);
		throw new Error("Failed to generate token");
	}
};

const stkPushService = async (req, res) => {
	try {
		if (!req.body || !req.body.phoneNumber) {
			return res.status(400).json({ message: "Phone number is required" });
		}

		const token = await createTokenService();

		const shortCode = 174379;
		const phone = req.body.phoneNumber.substring(1);
		const passkey =
			"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
		const timestamp = new Date()
			.toISOString()
			.replace(/[-T:Z.]/g, "")
			.substring(0, 14);

		const password = Buffer.from(shortCode + passkey + timestamp).toString(
			"base64"
		);

		const requestData = {
			BusinessShortCode: shortCode,
			Password: password,
			Timestamp: timestamp,
			TransactionType: "CustomerPayBillOnline",
			Amount: req.body.amount || 1,
			PartyA: `254${phone}`,
			PartyB: 174379,
			PhoneNumber: `254${phone}`,
			CallBackURL: "https://mydomain.com/path",
			AccountReference: "Mpesa Test",
			TransactionDesc: "Testing stk push",
		};

		const response = await Axios.post(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
			requestData,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		return res.status(200).json(response.data);
	} catch (error) {
		console.error("STK Push Error:", error.message);
		return res
			.status(500)
			.json({ message: "STK Push failed", error: error.message });
	}
};

module.exports = { createTokenService, stkPushService };
