export interface CallRecord {
    id: string;
    timestamp: string;
    call_id: string;
    caller_name: string;
    phone: string;
    callback_date: string;
    callback_time: string;
    assigned_to: string;
    status: string;
    call_duration: string;
    transcript: string;
    recording_url: string;
    summary: string;
    created_at: string;
    updated_at: string;
}

export type UserRole = 'admin' | 'viewer';

export interface UserProfile {
    id: string;
    role: UserRole;
    full_name?: string;
}
