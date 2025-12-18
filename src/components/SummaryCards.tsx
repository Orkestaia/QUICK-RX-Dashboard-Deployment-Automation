import React from 'react';
import { Phone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
    totalCalls: number;
    completed: number;
    callbacks: number;
    failed: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totalCalls, completed, callbacks, failed }) => {
    const cards = [
        { label: 'Total Calls', value: totalCalls, icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Callbacks', value: callbacks, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Failed/Missed', value: failed, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
                <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className={`${card.bg} p-3 rounded-xl`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
