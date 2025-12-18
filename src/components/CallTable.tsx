import React from 'react';
import { CallRecord } from '@/types';
import { format } from 'date-fns';

interface CallTableProps {
    calls: CallRecord[];
    onRowClick: (call: CallRecord) => void;
}

export const CallTable: React.FC<CallTableProps> = ({ calls, onRowClick }) => {
    return (
        <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-semibold tracking-wider">Date/Time</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Caller</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Phone</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Assigned To</th>
                        <th className="px-6 py-4 font-semibold tracking-wider">Duration</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {calls.map((call) => (
                        <tr
                            key={call.call_id}
                            onClick={() => onRowClick(call)}
                            className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {call.timestamp ? format(new Date(call.timestamp), 'MMM d, yyyy') : 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {call.timestamp ? format(new Date(call.timestamp), 'h:mm a') : ''}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-medium">{call.caller_name || 'Anonymous'}</td>
                            <td className="px-6 py-4 text-gray-600 font-mono tracking-tighter">{call.phone}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${call.status?.toLowerCase().includes('complet') ? 'bg-green-50 text-green-700 border-green-100' :
                                        call.status?.toLowerCase().includes('fail') ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                    {call.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{call.assigned_to || '-'}</td>
                            <td className="px-6 py-4 text-gray-600">{call.call_duration || '0'}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {calls.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 text-sm font-medium">No records found matching your filters.</p>
                </div>
            )}
        </div>
    );
};
