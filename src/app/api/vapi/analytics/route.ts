import { NextRequest, NextResponse } from 'next/server';

const VAPI_SECRET_KEY = process.env.VAPI_SECRET_KEY || '8f795435-93b1-4b99-b808-56dac1f5d6ab';

export async function POST(req: NextRequest) {
    try {
        const { queries } = await req.json();

        const response = await fetch('https://api.vapi.ai/analytics', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VAPI_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queries }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
