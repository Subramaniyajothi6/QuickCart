// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import connectDB from '@/config/db';
// import Order from '@/models/order';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export async function POST(request) {
//     try {
//         await connectDB();

//         const body = await request.text();
//         const sig = request.headers.get('stripe-signature');

//         // Verify webhook signature
//         let event;
//         try {
//             event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
//         } catch (err) {
//             console.error('Webhook signature verification failed:', err.message);
//             return NextResponse.json(
//                 { error: 'Webhook signature verification failed' },
//                 { status: 400 }
//             );
//         }

//         console.log('📥 Webhook event received:', event.type);

//         // Handle successful payment
//         if (event.type === 'charge.succeeded') {
//             const charge = event.data.object;
//             const sessionId = charge.payment_intent;

//             // Find order by stripe session ID
//             const order = await Order.findOne({ stripeSessionId: sessionId });

//             if (order) {
//                 order.paymentStatus = 'completed';
//                 await order.save();
//                 console.log('✅ Order payment completed:', order._id);
//             }
//         }

//         // Handle failed payment
//         if (event.type === 'charge.failed') {
//             const charge = event.data.object;
//             const sessionId = charge.payment_intent;

//             const order = await Order.findOne({ stripeSessionId: sessionId });

//             if (order) {
//                 order.paymentStatus = 'failed';
//                 await order.save();
//                 console.log('❌ Order payment failed:', order._id);
//             }
//         }

//         return NextResponse.json({ received: true });
//     } catch (error) {
//         console.error('Webhook error:', error);
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/config/db';
import Order from '@/models/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();
        const sig = request.headers.get('stripe-signature');

        // Verify webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } catch (err) {
            console.error('❌ Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }

        console.log('📥 Webhook event received:', event.type);

        await connectDB();

        // Handle the event based on type
        switch (event.type) {
            case 'checkout.session.completed':
                // Payment succeeded immediately (credit card, etc.)
                const completedSession = event.data.object;
                
                if (completedSession.payment_status === 'paid') {
                    await handleSuccessfulPayment(completedSession);
                }
                break;

            case 'checkout.session.async_payment_succeeded':
                // Payment succeeded later (ACH, bank transfer, etc.)
                await handleSuccessfulPayment(event.data.object);
                break;

            case 'checkout.session.async_payment_failed':
                // Payment failed
                await handleFailedPayment(event.data.object);
                break;

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// ✅ Handle successful payment - CORRECTED
async function handleSuccessfulPayment(session) {
    try {
        console.log('💳 Processing successful payment for session:', session.id);

        // Find order by Stripe CHECKOUT SESSION ID
        const order = await Order.findOne({ stripeSessionId: session.id });

        if (order) {
            // ✅ FIXED: Use 'completed' instead of 'paid' (matches your Order model enum)
            order.paymentStatus = 'completed';
            order.stripePaymentIntentId = session.payment_intent;
            // ✅ FIXED: Update payment method to 'card' (matches your Order model enum)
            order.paymentMethod = 'card';
            await order.save();
            
            console.log('✅ Order payment status updated to COMPLETED:', order._id);
        } else {
            console.log('⚠️ Order not found for session:', session.id);
        }
    } catch (error) {
        console.error('❌ Error handling successful payment:', error);
        console.error('Error details:', error.message);
    }
}

// ✅ Handle failed payment
async function handleFailedPayment(session) {
    try {
        console.log('❌ Processing failed payment for session:', session.id);

        // Find order by Stripe CHECKOUT SESSION ID
        const order = await Order.findOne({ stripeSessionId: session.id });

        if (order) {
            // ✅ 'failed' is already correct (matches your Order model enum)
            order.paymentStatus = 'failed';
            await order.save();
            
            console.log('❌ Order payment status updated to FAILED:', order._id);
        } else {
            console.log('⚠️ Order not found for session:', session.id);
        }
    } catch (error) {
        console.error('❌ Error handling failed payment:', error);
        console.error('Error details:', error.message);
    }
}
