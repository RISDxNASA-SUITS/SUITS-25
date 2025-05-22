import { NextResponse } from "next/server"

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_IP ? `http://${process.env.NEXT_PUBLIC_JAVA_IP}` : '';

export async function GET() {
    try {
        const response = await fetch(`${BASE_URL}/poi`);
        const data = await response.json();
       
        return NextResponse.json(data);
    } catch (error) {
        console.log(error, 'is the error');
        return NextResponse.json({ error: 'Failed to fetch POIs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {

        const body = await request.json();
      
        const response = await fetch(`${BASE_URL}/poi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        console.log(response, "is the response");
        const json = await response.json()
        console.log(json, "is the json");
        
       return NextResponse.json(json)
    } catch (error) {
        console.log(error, "is the error")
        return NextResponse.json({ error: 'Failed to create POI' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch(`${BASE_URL}/poi`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const json = await response.text();
        return NextResponse.json(json);
    } catch (error) {
        console.log(error, "is the error")
        return NextResponse.json({ error: 'Failed to update POI' }, { status: 500 });
    }
}

