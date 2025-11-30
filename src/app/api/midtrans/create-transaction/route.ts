import { NextRequest, NextResponse } from "next/server";
import environment from "@/config/environment";

export const runtime = "nodejs";

const MIDTRANS_SERVER_KEY = environment.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL =
  environment.MIDTRANS_BASE_URL || "https://app.sandbox.midtrans.com";

interface MidtransRequestBody {
  orderId: number;
  orderCode?: string | null;
  amount: number;
  customerName: string;
  phone?: string;
  address?: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!MIDTRANS_SERVER_KEY) {
      return NextResponse.json(
        { message: "MIDTRANS_SERVER_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as MidtransRequestBody;
    const { orderId, orderCode, amount, customerName, phone, address } = body;

    if (!orderId || !amount || !customerName) {
      return NextResponse.json(
        { message: "orderId, amount, and customerName are required" },
        { status: 400 }
      );
    }

    const authHeader =
      "Basic " + Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

    const response = await fetch(
      `${MIDTRANS_BASE_URL}/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: orderCode || `order-${orderId}`,
            gross_amount: amount,
          },
          customer_details: {
            first_name: customerName,
            phone,
            billing_address: {
              first_name: customerName,
              phone,
              address,
            },
            shipping_address: {
              first_name: customerName,
              phone,
              address,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { message: "Midtrans error", detail: text },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { redirectUrl: data.redirect_url, token: data.token },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
