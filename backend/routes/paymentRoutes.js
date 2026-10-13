import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { initiatePayment, paymentSuccess, paymentFail, paymentCancel, paymentIPN, adminPaymentsSummary, adminPaymentsList } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/:appointmentId/initiate", requireAuth, initiatePayment);
// SSLCommerz payment callbacks.
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);
router.get("/admin/summary", requireAuth, requireRole("admin"), adminPaymentsSummary);
router.get("/admin/list", requireAuth, requireRole("admin"), adminPaymentsList);

export default router;