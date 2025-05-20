import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;

    const audioId = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/audio`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json',
        }
    });
    const json = await audioId.json();
  
    return NextResponse.json(json);
}


export async function GET(req: NextRequest) {
    const audioId = req.nextUrl.searchParams.get('audioId');
    const audio = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/audio/${audioId}`);
    const audioBlob = await audio.blob();
    
    return new NextResponse(audioBlob, {
        headers: {
            'Content-Type': audio.headers.get('Content-Type') || 'audio/mpeg',
            'Content-Disposition': `attachment; filename="audio-${audioId}.mp3"`
        }
    });
}