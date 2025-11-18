
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/config/db';
import Product from '@/models/product';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';
import Order from '@/models/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    await connectDB();

    const { amount, currency, cartItems, addressId } = await request.json();

    // Validate cart items and calculate actual amount
    let calculatedAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product ${item.product} not found`
        }, { status: 404 });
      }
      calculatedAmount += product.offerPrice * item.quantity;
    }

    const tax = Math.floor(calculatedAmount * 0.02);
    const totalAmount = calculatedAmount + tax;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: 'Order Total',
              description: `Order with ${cartItems.length} items`,
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://quick-cart-five-mocha.vercel.app'}/my-orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://quick-cart-five-mocha.vercel.app'}/checkout?canceled=true`,
      metadata: {
        userId,
        addressId: addressId,
        cartItems: JSON.stringify(cartItems),
      },
    });

    // Create order record in database with pending status
    const newOrder = await Order.create({
      userId,
      address: addressId,
      items: cartItems,
      amount: totalAmount,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      stripeSessionId: session.id,
      status: 'Order Placed',
      date: Date.now()
    });

    console.log('✅ Order created with ID:', newOrder._id);
    console.log('✅ Stripe Session ID:', session.id);

    // Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItem = {};
      await user.save();
      console.log('✅ Cart cleared for user:', userId);
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderId: newOrder._id.toString()
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}
