import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/config/db';
import Order from '@/models/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.text();
        const sig = request.headers.get('stripe-signature');

        // Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }

        console.log('📥 Webhook event received:', event.type);

        // Handle successful payment
        if (event.type === 'charge.succeeded') {
            const charge = event.data.object;
            const sessionId = charge.payment_intent;

            // Find order by stripe session ID
            const order = await Order.findOne({ stripeSessionId: sessionId });

            if (order) {
                order.paymentStatus = 'completed';
                await order.save();
                console.log('✅ Order payment completed:', order._id);
            }
        }

        // Handle failed payment
        if (event.type === 'charge.failed') {
            const charge = event.data.object;
            const sessionId = charge.payment_intent;

            const order = await Order.findOne({ stripeSessionId: sessionId });

            if (order) {
                order.paymentStatus = 'failed';
                await order.save();
                console.log('❌ Order payment failed:', order._id);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
