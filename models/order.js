import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    status: { type: String, default: 'Order Placed', required: true },
    paymentMethod: { 
        type: String, 
        enum: ['card', 'cod'], 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    stripeSessionId: { type: String }, 
    date: { type: Number, required: true }
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;
