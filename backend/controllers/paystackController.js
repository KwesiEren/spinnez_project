const paystack = require('../utils/paystack');
const { Transaction, User } = require('../models');
const crypto = require('crypto');

exports.initializePayment = async (req, res) => {
    try {
        const { email, amount, user_id } = req.body;

        const response = await paystack.post('/transaction/initialize', {
            email,
            amount: amount * 100, // convert to kobo
            callback_url: `${process.env.FRONTEND_URL}/payment-success`,
        });

        // Save transaction
        await Transaction.create({
            user_id,
            amount,
            reference: response.data.data.reference,
        });

        return res.status(200).json({
            status: true,
            message: 'Payment initialized',
            data: response.data.data,
        });
    } catch (error) {
        console.error('Paystack Init Error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        const response = await paystack.get(`/transaction/verify/${reference}`);
        const { data } = response.data;

        const transaction = await Transaction.findOne({ where: { reference } });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (data.status === 'success') {
            transaction.status = 'success';
            await transaction.save();

            // update user to premium
            await User.update({ is_premium: true }, { where: { id: transaction.user_id } });

            return res.json({ message: 'Payment verified successfully', data });
        } else {
            transaction.status = 'failed';
            await transaction.save();
            return res.status(400).json({ message: 'Payment failed' });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
};

exports.webhookHandler = async (req, res) => {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        const event = req.body.event;
        const data = req.body.data;

        if (event === 'charge.success') {
            const transaction = await Transaction.findOne({ where: { reference: data.reference } });
            if (transaction && transaction.status !== 'success') {
                transaction.status = 'success';
                await transaction.save();

                // upgrade user to premium
                await User.update({ is_premium: true }, { where: { id: transaction.user_id } });
            }
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ message: 'Webhook error' });
    }
};
