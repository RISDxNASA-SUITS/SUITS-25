import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_IP ? `http://${process.env.NEXT_PUBLIC_JAVA_IP}` : '';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(`${BASE_URL}/poi/${params.id}`, {
            method: 'DELETE',
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete POI' }, { status: 500 });
    }
} 