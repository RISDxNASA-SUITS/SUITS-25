import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. pull x,y (and name, if you like) out of the client’s POST body
    const {x, y} = await request.json();
    console.log("x: ", x, "y: ", y)
    // 2. forward it on to your Python service
    const response = await fetch('http://127.0.0.1:4000/navigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({x, y}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 3. bubble the Python service’s JSON right back to the client
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error in navigation:', err);
    return NextResponse.json(
      { error: 'Navigation failed' },
      { status: 500 }
    );
  }
}