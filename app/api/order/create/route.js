// import connectDB from "@/config/db"
// import { inngest } from "@/config/inngest"
// import Product from "@/models/product"
// import User from "@/models/User"
// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"

// export async function POST(request) {
//     try {
//         const { userId } = await auth()
//         if (!userId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Unauthorized"
//             }, { status: 401 });
//         }
//         const { address, items } = await request.json()
//         if (!address || !items || items.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Invalid data - address and items required"
//             }, { status: 400 });
//         }
//         await connectDB()

//         // calculate the amount using items 
//         let amount = 0;
//         for (const item of items) {

//             console.log(item);
            
//             const product = await Product.findById(item.product);
//             if (!product) {
//                 return NextResponse.json({
//                     success: false,
//                     message: `Product ${item.product} not found`
//                 }, { status: 404 });
//             }
//             amount += product.offerPrice * item.quantity;
//             console.log('📤 Sending order event to Inngest...');
//         }
//         const tax = amount * 0.02;
//         const totalAmount = amount + tax;

//         const result = await inngest.send({
//             name: 'order/created',
//             data: {
//                 userId,
//                 address,
//                 items,
//                 amount: totalAmount,
//                 date: Date.now()
//             },

//         })

//         if (result.isError) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Error creating order"
//             }, { status: 500 });
//         }

//         console.log("📤 Order event sent to Inngest ",result);
        
//         // clear user cart 
//         const user = await User.findById(userId)
//         if (!user) {
//             return NextResponse.json({
//                 success: false,
//                 message: "User not found"
//             }, { status: 404 });
//         }
//         user.cartItem = {}
//         await user.save()
//         return NextResponse.json({ success: true, message: "Order placed successfully" })

//     } catch (error) {
//         console.error('Error creating order:', error);
//         return NextResponse.json({ success: false, message: error.message })
//     }
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// import connectDB from "@/config/db"
// import { inngest } from "@/config/inngest"
// import Order from "@/models/order"
// import Product from "@/models/product"
// import User from "@/models/User"
// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"

// export async function POST(request) {
//     try {
//         const { userId } = await auth()
//         if (!userId) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Unauthorized"
//             }, { status: 401 });
//         }

//         const { address, items } = await request.json()
//         if (!address || !items || items.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 message: "Invalid data - address and items required"
//             }, { status: 400 });
//         }

//         await connectDB()

//         // Calculate the amount using items 
//         let amount = 0;
//         for (const item of items) {
//             console.log(item);
            
//             const product = await Product.findById(item.product);
//             if (!product) {
//                 return NextResponse.json({
//                     success: false,
//                     message: `Product ${item.product} not found`
//                 }, { status: 404 });
//             }
//             amount += product.offerPrice * item.quantity;
//         }

//         const tax = Math.floor(amount * 0.02);
//         const totalAmount = amount + tax;

//         // ✅ SAVE ORDER TO DATABASE FIRST
//         const order = await Order.create({
//             userId,
//             items: items,
//             amount: totalAmount,
//             address: address,
//             status: 'Order Placed',
//             date: Date.now()
//         });

//         console.log('✅ Order saved to database with ID:', order._id);

//         // THEN send Inngest event
//         const result = await inngest.send({
//             name: 'order/created',
//             data: {
//                 orderId: order._id.toString(),
//                 userId,
//                 address,
//                 items,
//                 amount: totalAmount,
//                 date: Date.now()
//             }
//         });

//         if (result.isError) {
//             console.error('❌ Inngest error:', result);
//             return NextResponse.json({
//                 success: false,
//                 message: "Error creating order"
//             }, { status: 500 });
//         }

//         console.log("📤 Order event sent to Inngest", result);
        
//         // Clear user cart 
//         const user = await User.findById(userId);
//         if (!user) {
//             return NextResponse.json({
//                 success: false,
//                 message: "User not found"
//             }, { status: 404 });
//         }

//         user.cartItem = {};
//         await user.save();

//         return NextResponse.json({ 
//             success: true, 
//             message: "Order placed successfully",
//             orderId: order._id
//         });

//     } catch (error) {
//         console.error('Error creating order:', error);
//         return NextResponse.json({ 
//             success: false, 
//             message: error.message 
//         }, { status: 500 });
//     }
// }


///////////////////////////////////////////////////////////////////////////////////////////////////////


import connectDB from "@/config/db"
import { inngest } from "@/config/inngest"
import Order from "@/models/order"
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

        const { address, items, stripeSessionId } = await request.json()
        if (!address || !items || items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Invalid data - address and items required"
            }, { status: 400 });
        }

        await connectDB()

        // Calculate the amount using items 
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
        }

        const tax = Math.floor(amount * 0.02);
        const totalAmount = amount + tax;

        // Save order to database
        const order = await Order.create({
            userId,
            items: items,
            amount: totalAmount,
            address: address,
            status: 'Order Placed',
            paymentMethod: stripeSessionId ? 'card' : 'cod',
            paymentStatus: 'pending',
            stripeSessionId: stripeSessionId || null,
            date: Date.now()
        });

        console.log('✅ Order saved to database with ID:', order._id);

        // Send Inngest event
        const result = await inngest.send({
            name: 'order/created',
            data: {
                orderId: order._id.toString(),
                userId,
                address,
                items,
                amount: totalAmount,
                paymentMethod: stripeSessionId ? 'card' : 'cod',
                date: Date.now()
            }
        });

        if (result.isError) {
            console.error('❌ Inngest error:', result);
            return NextResponse.json({
                success: false,
                message: "Error creating order"
            }, { status: 500 });
        }

        console.log("📤 Order event sent to Inngest", result);
        
        // Clear user cart 
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        user.cartItem = {};
        await user.save();

        return NextResponse.json({ 
            success: true, 
            message: "Order placed successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}
