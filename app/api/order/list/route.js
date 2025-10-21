import connectDB from "@/config/db"
import Address from "@/models/address"
import Order from "@/models/order"
import Product from "@/models/product"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET () {
    try {

        const {userId} = await auth()
        await connectDB()
        Address.length
        Product.length
        const orders = await Order.find({userId}).populate('address items.product')
        return NextResponse.json({success: true, orders})
        
    } catch (error) {
        return NextResponse.json({success: false, message: error.message})
    }
}