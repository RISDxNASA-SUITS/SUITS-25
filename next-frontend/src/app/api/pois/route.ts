import { NextResponse } from "next/server"


export async function GET(request:Request){
    const data = await fetch("http://localhost:7070/pois")
    const json = await data.json()
    return NextResponse.json(json)
}