const express = require("express");
const router = express.Router();
const { Payment } = require("../controllers/payment");
const {verifyEsewaPayment} = require("../controllers/verifypayment");
// const { paymentSuccess } = require("../controllers/paymentSuccess");


router.route("/payment").post(Payment);
router.route("/verify-payment").post(verifyEsewaPayment);
// router.route("/payment/success").get(paymentSuccess);

module.exports = router;
