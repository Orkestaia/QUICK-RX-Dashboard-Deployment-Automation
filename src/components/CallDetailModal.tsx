import React from 'react';
import { CallRecord } from '@/types';
import { X, User, Phone, Play, FileText, Clock, Calendar } from 'lucide-react';

interface CallDetailModalProps {
    call: CallRecord | null;
    onClose: () => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({ call, onClose }) => {
    if (!call) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in zoom-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Call Details</h2>
                        <p className="text-xs text-gray-500 font-medium">ID: {call.call_id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors group">
                        <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-50 p-3 rounded-2xl">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Caller Name</p>
                                <p className="text-lg font-bold text-gray-900">{call.caller_name || 'Anonymous'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl">
                                <Phone className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Phone Number</p>
                                <p className="text-lg font-bold text-gray-900 font-mono">{call.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-teal-50 p-3 rounded-2xl">
                                <Calendar className="h-6 w-6 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Callback Date</p>
                                <p className="text-lg font-medium text-gray-900">{call.callback_date || 'Not scheduled'}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-purple-50 p-3 rounded-2xl">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Callback Time</p>
                                <p className="text-lg font-medium text-gray-900">{call.callback_time || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recording Player */}
                    {call.recording_url && (
                        <div className="bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center tracking-widest">
                                <Play className="h-3 w-3 mr-2 fill-emerald-500 text-emerald-500" /> Call Recording
                            </p>
                            <audio src={call.recording_url} controls className="w-full h-10 filter invert opacity-90" />
                        </div>
                    )}

                    {/* Summary Section */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center tracking-widest">
                            <FileText className="h-3.5 w-3.5 mr-2 text-blue-500" /> AI Executive Summary
                        </p>
                        <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100/50 text-sm italic text-gray-800 leading-relaxed shadow-sm">
                            "{call.summary}"
                        </div>
                    </div>

                    {/* Transcript Section */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Conversation Transcript</p>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                            {call.transcript}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-gray-200 active:scale-95"
                    >
                        Done Viewing
                    </button>
                </div>
            </div>
        </div>
    );
};
