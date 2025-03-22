const express = require("express");
const router = express.Router();
const { Payment } = require("../controllers/payment");
const {verifyEsewaPayment} = require("../controllers/verifypayment");
const {getPayments} = require("../controllers/paymentpage");
const {getinfo} = require("../controllers/getinfo");
const{updatePaymentStatus}=require("../controllers/updatepay.js");
const {taskerpayment} = require("../controllers/taskerpaymentpage.js");


router.route("/payment").post(Payment);
router.route("/verify-payment").post(verifyEsewaPayment);
router.route("/getPayments").get(getPayments);
router.route("/getinfo").get(getinfo);
router.route("/updatepaymentstatus").put(updatePaymentStatus);
router.route("/taskerpayment").get(taskerpayment);


module.exports = router;
