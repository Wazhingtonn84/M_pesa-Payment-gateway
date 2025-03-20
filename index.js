const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Serving running on port ${8080}`);
});
