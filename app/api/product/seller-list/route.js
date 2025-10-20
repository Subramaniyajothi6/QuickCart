import connectDB from "@/config/db"
import authSeller from "@/lib/authSeller"
import Product from "@/models/product"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET (request) {
    try {
        const { userId } = await auth() 
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized user", status: 401 })
        }

        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized role ", status: 403})
        }
        await connectDB()
        const products = await Product.find({})
        return NextResponse.json({ success: true, products }) 
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({ success: false, message: error.message , status: 500})
    }

}