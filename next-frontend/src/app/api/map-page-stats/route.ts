import { NextResponse } from 'next/server';

interface RoverTelemetry {
    speed: number;
    heading: number;
    distanceFromBase: number;
    pitch: number;
    roll: number;
    surfaceIncline: number;
    currentPosX: number;
    currentPosY: number;
    missionElapsedTime: number;
    missionPlannedTime: number;
    pointOfNoReturn: number;
}

export async function GET(request: Request) {
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/telemetry`);
        if (!response.ok) {
            throw new Error('Failed to fetch rover data');
        }
        
        const data = await response.json();
        
        // Format the data to match the PrTelemetry fields
        const roverData: RoverTelemetry = {
            speed: data.speed || 0,
            heading: data.heading || 0,
            distanceFromBase: data.distanceFromBase || 0,
            pitch: data.pitch || 0,
            roll: data.roll || 0,
            surfaceIncline: data.surfaceIncline || 0,
            currentPosX: data.currentPosX || 0,
            currentPosY: data.currentPosY || 0,
            missionElapsedTime: data.missionElapsedTime || 0,
            missionPlannedTime: data.missionPlannedTime || 0,
            pointOfNoReturn: data.pointOfNoReturn || 0
        };

        return NextResponse.json(roverData);
    } catch (error) {
        console.error('Error fetching rover data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rover data' },
            { status: 500 }
        );
    }
}