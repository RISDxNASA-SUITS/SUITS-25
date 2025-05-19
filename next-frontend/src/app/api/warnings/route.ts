import { NextResponse } from 'next/server';



export async function GET(request: Request) {
    try {
        const response = await fetch(`http://${process.env.NEXT_PUBLIC_JAVA_IP}/error`);
        if (!response.ok) {
            throw new Error('Failed to fetch error state');
        }
        
        const data = await response.json();
        
        // Format the data to match the ErrorState interface
        const errorState= {
            fan_error: {
                isErr:data.fan_error || false,
                desc:"Please return to the lander immediately",
                name:"Fan Error"
            },
            oxy_error: {
                isErr:data.oxy_error || false,
                desc:"Please return to the lander immediately",
                name:"Oxygen Error", 
            },
            pump_error: {
                isErr:data.pump_error || false,
                desc:"Please return to the lander immediately",
                name:"Pump Error"
            }
        };

        return NextResponse.json(errorState);
    } catch (error) {
        console.error('Error fetching error state:', error);
        return NextResponse.json(
            { error: 'Failed to fetch error state' },
            { status: 500 }
        );
    }
}