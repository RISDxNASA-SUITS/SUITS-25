import { NextResponse } from "next/server"

export async function POST(request:Request, {params}:{params: {id: string}}){
    const {id} = params
    const body = await request.json()
    const {tags} = body

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pois/updateTags/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({tags}),
    })
    return NextResponse.json({message: "Tags updated successfully"})
}