import connectDB from "@/config/db"
import { inngest } from "@/config/inngest"
import Product from "@/models/product"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }
        const { address, items } = await request.json()
        if (!address || !items || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Invalid data - address and items required"
            }, { status: 400 });
        }
        await connectDB()

        // calculate the amount using items 
        let amount = 0;
        for (const item of items) {

            console.log(item);
            
            const product = await Product.findById(item.product);
            if (!product) {
                return NextResponse.json({
                    success: false,
                    message: `Product ${item.product} not found`
                }, { status: 404 });
            }
            amount += product.offerPrice * item.quantity;
            console.log('📤 Sending order event to Inngest...');
        }
        const tax = amount * 0.02;
        const totalAmount = amount + tax;

        const result = await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: totalAmount,
                date: Date.now()
            },

        })

        if (result.isError) {
            return NextResponse.json({
                success: false,
                message: "Error creating order"
            }, { status: 500 });
        }

        console.log("📤 Order event sent to Inngest fjfjfjfjfjfjfjfj",result);
        
        // clear user cart 
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }
        user.cartItem = {}
        await user.save()
        return NextResponse.json({ success: true, message: "Order placed successfully" })

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ success: false, message: error.message })
    }
}