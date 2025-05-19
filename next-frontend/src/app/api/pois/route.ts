import { NextResponse } from "next/server"


export async function GET(request:Request){
    const data = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/poi`)
    const json = await data.json()
    console.log(json)
    return NextResponse.json(json)
}