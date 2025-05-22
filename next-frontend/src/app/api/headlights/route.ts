import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body);
    const data = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/headlights`, {
        method: "POST",
        body: JSON.stringify(body)
    })
    return Response.json({ message: "Headlights updated" });
}