import { NextResponse } from "next/server"

export async function POST(request:Request, {params}:{params: {id: string}}){
    const {id} = await params
    const body = await request.json()
    const {tags} = body

    await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/poi/updateTags/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({tags}),
    })
    return NextResponse.json({message: "Tags updated successfully"})
}