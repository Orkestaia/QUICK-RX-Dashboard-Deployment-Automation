"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { CallRecord } from '@/types';
import { SummaryCards } from '@/components/SummaryCards';
import { Filters } from '@/components/Filters';
import { CallTable } from '@/components/CallTable';
import { CallDetailModal } from '@/components/CallDetailModal';
import { Download, RefreshCcw, LayoutDashboard, Settings, User } from 'lucide-react';

export default function Dashboard() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchCalls = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('timestamp', { ascending: false });

    if (data) setCalls(data);
    setLoading(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchCalls();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calls' },
        () => {
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      const searchStr = `${call.caller_name} ${call.phone} ${call.summary}`.toLowerCase();
      const matchesSearch = searchStr.includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [calls, search, statusFilter]);

  const metrics = useMemo(() => {
    return {
      total: calls.length,
      completed: calls.filter(c => c.status?.toLowerCase().includes('complet')).length,
      callbacks: calls.filter(c => c.status?.toLowerCase().includes('callback')).length,
      failed: calls.filter(c => c.status?.toLowerCase().includes('fail') || c.status?.toLowerCase().includes('missed')).length,
    };
  }, [calls]);

  const handleExport = () => {
    const headers = ['Timestamp', 'Name', 'Phone', 'Status', 'Summary'];
    const csvContent = [
      headers.join(','),
      ...filteredCalls.map(c => [
        c.timestamp,
        `"${c.caller_name || 'Anonymous'}"`,
        c.phone,
        c.status,
        `"${(c.summary || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `quickrx_calls_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">QuickRx <span className="text-blue-600">OS</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Sync</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Voice Assistant Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring all incoming calls and AI assistant interactions.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCalls}
              className="group p-2.5 text-gray-500 hover:text-blue-600 bg-white rounded-xl border border-gray-200 transition-all hover:shadow-md active:scale-95"
              title="Refresh Data"
            >
              <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status indicator for non-admins to know it is live */}
        <div className="mb-6 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-400">
          <span>Real-time Metrics</span>
          <span>Last sync: {lastUpdated.toLocaleTimeString()}</span>
        </div>

        {/* Metrics Grid */}
        <SummaryCards
          totalCalls={metrics.total}
          completed={metrics.completed}
          callbacks={metrics.callbacks}
          failed={metrics.failed}
        />

        {/* Search & Filters Section */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
          <Filters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Data Table */}
        <div className="relative">
          {loading && calls.length === 0 ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <CallTable calls={filteredCalls} onRowClick={setSelectedCall} />
          )}
        </div>
      </main>

      {/* Call Details Drawer/Modal */}
      <CallDetailModal call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  );
}
