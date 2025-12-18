"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricChartProps {
    title: string;
    value: string | number;
    data: any[];
    dataKey: string;
    color: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({ title, value, data, dataKey, color }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-64">
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#color${dataKey})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
