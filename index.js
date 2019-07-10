const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const handler = require("./handler");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/login", handler.login);
app.post("/api/consumer/add", handler.verifyToken, handler.addConsumer);
app.get("/api/consumers", handler.verifyToken, handler.getAllConsumers);
app.put("/api/consumer/:id", handler.verifyToken, handler.updateConsumer);
app.delete("/api/consumer/:id", handler.verifyToken, handler.deleteConsumer);
app.get("/api/consumer/:id", handler.verifyToken, handler.getConsumerById);
app.post("/api/bill", handler.verifyToken, handler.addBill);
app.put("/api/bill/pay/:id", handler.verifyToken, handler.payBill);
app.get("/api/bills/:consumerId", handler.verifyToken, handler.getAllBills);
app.get( "/api/bills/unitConsumed/:consumerId",handler.verifyToken,handler.getAllUnitConsumed);
app.get("/api/unitCost", handler.verifyToken, handler.getPerUnitCost);
app.put("/api/unitCost", handler.verifyToken, handler.updatePerUnitCost);

app.listen(3000, () => console.log("Server running on port 3000"));
