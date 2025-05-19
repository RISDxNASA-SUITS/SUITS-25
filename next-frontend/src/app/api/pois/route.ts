import { NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_IP ? `http://${process.env.NEXT_PUBLIC_JAVA_IP}` : '';

export async function GET() {
    try {
        const response = await fetch(`${BASE_URL}/poi`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch POIs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {

        const body = await request.json();
        console.log(body)
        const response = await fetch(`${BASE_URL}/poi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        console.log(await response.text());
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.log(error, "is the error")
        return NextResponse.json({ error: 'Failed to create POI' }, { status: 500 });
    }
}