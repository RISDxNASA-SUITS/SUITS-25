import axios from 'axios'   
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const {data}:{data:GeoResponse[]}= await axios.get(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/geo`)
        
        return NextResponse.json(data)
    } catch (error) {
       
        return NextResponse.json({ error: 'Failed to fetch geo dust data' }, { status: 500 })
    }

}

export interface GeoResponse {
    id: number;
    createdAt: string;
    sio2: number;
    al2o3: number;
    mno: number;
    cao: number;
    p2o3: number;
    tio2: number;
    feo: number;
    mgo: number;
    k2o: number;
    other: number;
}