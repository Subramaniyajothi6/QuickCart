import connectDB from "@/config/db"
import authSeller from "@/lib/authSeller"
import Order from "@/models/order"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET () {
    try {
        const {userId} = await auth()
        const isSeller = await authSeller(userId)
        if(!isSeller){
            return NextResponse.json({success: false, message: "Unauthorized role"})
        }
        await connectDB()
        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({success: true, orders})
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}