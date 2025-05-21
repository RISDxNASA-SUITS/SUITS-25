import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_IP ? `http://${process.env.NEXT_PUBLIC_JAVA_IP}` : '';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = (await params).id;
    try {
        console.log(id);
        const response = await fetch(`${BASE_URL}/poi/${id}`, {
            method: 'DELETE',
        });
        console.log(response.status);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to delete POI' }, { status: 500 });
    }
} 