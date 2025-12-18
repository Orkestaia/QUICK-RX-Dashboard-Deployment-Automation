import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const syncToken = process.env.SYNC_TOKEN || ''

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization')

    if (!syncToken || authHeader !== `Bearer ${syncToken}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await req.json()
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Map Google Sheet columns to Supabase columns
        // Headers from sheet: Timestamp, Call_ID, Caller_Name, Phone, Callback_Date, Callback_Time, Assigned_To, Status, Call_Duration, Transcript, Recording_URL, Summary
        const callData = {
            timestamp: data.Timestamp,
            call_id: data.Call_ID,
            caller_name: data.Caller_Name,
            phone: data.Phone,
            callback_date: data.Callback_Date,
            callback_time: data.Callback_Time,
            assigned_to: data.Assigned_To,
            status: data.Status,
            call_duration: data.Call_Duration,
            transcript: data.Transcript,
            recording_url: data.Recording_URL,
            summary: data.Summary,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('calls')
            .upsert(callData, { onConflict: 'call_id' })

        if (error) {
            console.error('Supabase Upsert Error:', error)
            throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
