import connectDB from "@/config/db"
import { inngest } from "@/config/inngest"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"

export async function POST (request) {
    try {
        const {userId} = await auth()
        const {address,items} = await request.json()
        if(!address || items.length == 0){ {
            return NextResponse.json({success: false, message: "Invalid data"})
        }
    }
        // calculate the amount using items 
        const amount = items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return acc + product.offerPrice * item.quantity
        },0)

        await inngest.send({
            name:'order/created',
            data:{userId,address,items,amount:amount+ Math.floor(amount * 0.02),
                date:Date.now()
            },
            
        })

        // clear user cart 
        const user = await User.findById(userId)
        user.cartItem = []
        await user.save()
        return NextResponse.json({success: true, message: "Order placed successfully"})

    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}