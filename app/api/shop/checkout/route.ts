import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        // Extract userId from the request query params or headers
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Fetch user details
        const user = await prisma.user.findUnique({
            where: { clerk_user_id: userId },
            include: {
                address: true,
                bag: {
                    include: {
                        product: true,
                        variant_color: true,
                        variant_size: true,
                    },
                },
            },
        });

        if (!user || !user.bag || user.bag.length === 0) {
            return NextResponse.json(
                { error: "No items in the bag or user not found" },
                { status: 404 }
            );
        }

        // Calculate subtotal
        const subtotal = user.bag.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        // Add shipping fee
        const shippingFee = 100; // Flat shipping fee, adjust as needed
        const total = subtotal + shippingFee;

        // Prepare response data
        const responseData = {
            user: {
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                address: user.address.find((addr) => addr.is_default),
            },
            items: user.bag.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                color: item.variant_color?.color,
                size: item.variant_size?.size,
            })),
            subtotal,
            shippingFee,
            total,
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error in checkout GET endpoint:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, payment_method, proof_of_payment, address_id, landmark } = body;

        if (!user_id || !payment_method || !address_id) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Fetch user and bag items
        const user = await prisma.user.findFirst({
            where: { id: user_id },
            include: {
                bag: {
                    include: {
                        product: true,
                        variant_color: true,
                        variant_size: true,
                    },
                },
            },
        });

        if (!user || !user.bag || user.bag.length === 0) {
            return NextResponse.json(
                { error: "No items in the bag or user not found" },
                { status: 404 }
            );
        }

        // Calculate subtotal and create order items
        const subtotal = user.bag.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        const shippingFee = 100;
        const totalPrice = subtotal + shippingFee;

        // Create order and order items
        const order = await prisma.order.create({
            data: {
                user_id: user.id,
                status: "PENDING",
                total_price: totalPrice,
                payment_method: payment_method,
                proof_of_payment: proof_of_payment || [],
                tracking_number: null,
                landmark: landmark || null,
                address_id: address_id,
                order_item: {
                    create: user.bag.map((item) => ({
                        product_id: item.product.id,
                        variant_size_id: item.variant_size?.id || null,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
        });

        // Clear user bag
        await prisma.bag.deleteMany({
            where: { user_id: user.id },
        });

        return NextResponse.json({
            message: "Order created successfully",
            order,
        }, { status: 201 });
    } catch (error) {
        console.error("Error in checkout POST endpoint:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
