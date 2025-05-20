

export async function POST(req: Request) {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;
  
    return new Response('Audio uploaded successfully');
}