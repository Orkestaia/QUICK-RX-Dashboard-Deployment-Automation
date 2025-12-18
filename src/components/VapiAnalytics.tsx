"use client";

import React, { useEffect, useState } from 'react';
import { MetricChart } from './MetricChart';
import { Clock, Phone, CreditCard, Zap } from 'lucide-react';

export const VapiAnalytics = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ minutes: 0, calls: 0, cost: 0, avgCost: 0 });

    useEffect(() => {
        const fetchVapiMetrics = async () => {
            try {
                const response = await fetch('/api/vapi/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        queries: [
                            { table: 'call', column: 'minutesUsed', operation: 'sum', groupBy: ['date'] },
                            { table: 'call', column: 'id', operation: 'count', groupBy: ['date'] },
                            { table: 'call', column: 'cost', operation: 'sum', groupBy: ['date'] }
                        ]
                    })
                });

                const result = await response.json();

                // El formato de Vapi Analytics devuelve los resultados por tabla/operación
                // Necesitamos normalizarlo para Recharts
                if (result && Array.isArray(result)) {
                    const minutesData = result[0] || [];
                    const callsData = result[1] || [];
                    const costData = result[2] || [];

                    // Crear un mapa por fecha para combinar resultados
                    const dateMap: any = {};

                    minutesData.forEach((item: any) => {
                        if (!dateMap[item.date]) dateMap[item.date] = { date: item.date };
                        dateMap[item.date].minutes = parseFloat(item.sum.toFixed(2));
                    });

                    callsData.forEach((item: any) => {
                        if (!dateMap[item.date]) dateMap[item.date] = { date: item.date };
                        dateMap[item.date].calls = item.count;
                    });

                    costData.forEach((item: any) => {
                        if (!dateMap[item.date]) dateMap[item.date] = { date: item.date };
                        dateMap[item.date].cost = parseFloat(item.sum.toFixed(2));
                        dateMap[item.date].avgCost = dateMap[item.date].calls > 0 ? parseFloat((item.sum / dateMap[item.date].calls).toFixed(2)) : 0;
                    });

                    const chartData = Object.values(dateMap).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setData(chartData);

                    // Calcular totales
                    const totalMinutes = chartData.reduce((acc: number, curr: any) => acc + (curr.minutes || 0), 0);
                    const totalCalls = chartData.reduce((acc: number, curr: any) => acc + (curr.calls || 0), 0);
                    const totalCost = chartData.reduce((acc: number, curr: any) => acc + (curr.cost || 0), 0);

                    setTotals({
                        minutes: parseFloat(totalMinutes.toFixed(2)),
                        calls: totalCalls,
                        cost: parseFloat(totalCost.toFixed(2)),
                        avgCost: totalCalls > 0 ? parseFloat((totalCost / totalCalls).toFixed(2)) : 0
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Vapi metrics:", error);
                setLoading(false);
            }
        };

        fetchVapiMetrics();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-12">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-white border border-gray-100 rounded-3xl animate-pulse"></div>
            ))}
        </div>
    );

    return (
        <div className="mt-12 space-y-6">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
                <Zap className="h-3 w-3 fill-blue-600" />
                <span>Vapi AI Real-time Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricChart
                    title="Total Call Minutes"
                    value={totals.minutes}
                    data={data}
                    dataKey="minutes"
                    color="#10b981"
                />
                <MetricChart
                    title="Number of Calls"
                    value={totals.calls}
                    data={data}
                    dataKey="calls"
                    color="#f59e0b"
                />
                <MetricChart
                    title="Total Spent"
                    value={`$${totals.cost}`}
                    data={data}
                    dataKey="cost"
                    color="#6366f1"
                />
                <MetricChart
                    title="Avg Cost per Call"
                    value={`$${totals.avgCost}`}
                    data={data}
                    dataKey="avgCost"
                    color="#3b82f6"
                />
            </div>
        </div>
    );
};
