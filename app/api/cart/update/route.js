import connectDB from "@/config/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (request) {

    console.log("update cart");

    try {
        const { userId } = await auth()
        const {cartData} = await request.json()
        await connectDB()
        const user = await User.findById(userId)
        user.cartItem = cartData 
        await user.save()
        console.log(user)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }

}