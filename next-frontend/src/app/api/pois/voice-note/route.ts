import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_IP ? `http://${process.env.NEXT_PUBLIC_JAVA_IP}` : '';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${BASE_URL}/poi/addVoiceNote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add voice note' }, { status: 500 });
    }
} 