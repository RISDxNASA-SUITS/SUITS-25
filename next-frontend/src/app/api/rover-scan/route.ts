import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Calling scan api");
    const response = await fetch('http://127.0.0.1:4000/scan', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error scanning area:', error);
    return NextResponse.json(
      { error: 'Failed to scan area' },
      { status: 500 }
    );
  }
}
