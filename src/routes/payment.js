const express = require("express");
const router = express.Router();
const { Payment } = require("../controllers/payment");
const {verifyEsewaPayment} = require("../controllers/verifypayment");
const {getPayments} = require("../controllers/paymentpage");
const {getinfo} = require("../controllers/getinfo");

router.route("/payment").post(Payment);
router.route("/verify-payment").post(verifyEsewaPayment);
router.route("/getPayments").get(getPayments);
router.route("/getinfo").get(getinfo);

module.exports = router;
