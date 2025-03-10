const express = require("express");
const router = express.Router();
const { Payment } = require("../controllers/payment");
const {verifyEsewaPayment} = require("../controllers/verifypayment");
const {getPayments} = require("../controllers/paymentpage");


router.route("/payment").post(Payment);
router.route("/verify-payment").post(verifyEsewaPayment);
router.route("/getPayments").get(getPayments);

module.exports = router;
