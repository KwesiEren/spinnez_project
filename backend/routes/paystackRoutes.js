const express = require('express');
const router = express.Router();
const paystackController = require('../controllers/paystackController');
const auth = require('../middleware/auth');
const { authMiddleware } = require('../middleware/auth');

// Webhook route does not need auth middleware as it's called by Paystack
// It also needs a raw body parser for signature verification, which is why we apply it here specifically.
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    paystackController.webhookHandler
);

router.post('/initialize', authMiddleware, paystackController.initializePayment);
router.get('/verify/:reference', authMiddleware, paystackController.verifyPayment);

module.exports = router;
