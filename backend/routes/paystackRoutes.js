const express = require('express');
const router = express.Router();
const paystackController = require('../controllers/paystackController');

router.post('/initialize', paystackController.initializePayment);
router.get('/verify/:reference', paystackController.verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), paystackController.webhookHandler);

module.exports = router;
