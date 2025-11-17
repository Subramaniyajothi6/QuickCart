// import connectDB from "@/config/db"
// import User from "@/models/User"
// import { auth } from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"

// export async function GET(request) {
//     try {
//         const { userId } = await auth() 
        
//         if (!userId) {
//             return NextResponse.json({ success: false, message: "Unauthorized" })
//         }
        
//         await connectDB()
//         const user = await User.findById(userId)
        
//         if (!user) {
//             return NextResponse.json({ success: false, message: "User not found" })
//         }
//         if (Array.isArray(user.cartItem)) {
//             user.cartItem = {};
//             await user.save();
//         }
        
//         console.log('User cart from DB:', user.cartItem);
        
//         return NextResponse.json({ success: true, data: user })
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message })
//     }
// }


import connectDB from "@/config/db"
import User from "@/models/User"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { userId } = await auth() 
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" })
        }
        
        await connectDB()
        const user = await User.findById(userId)
        
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" })
        }
        
        // Fix cartItem if it's an array
        if (Array.isArray(user.cartItem)) {
            user.cartItem = {};
            await user.save();
        }
        
        console.log('User cart from DB:', user.cartItem);
        
        // ✅ FIXED: Changed 'data' to 'user' to match frontend expectation
        return NextResponse.json({ success: true, user: user })
    } catch (error) {
        console.error('Error in /api/user/data:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
