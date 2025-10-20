import connectDB from "@/config/db"
import Product from "@/models/product"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {

        await connectDB()
        const products = await Product.find({})
        return NextResponse.json({ success: true, products })
    } catch (error) {
        console.log(error.message);

        return NextResponse.json({ success: false, message: error.message, status: 500 })
    }

}