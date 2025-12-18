import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({ search, onSearchChange, statusFilter, onStatusChange }) => {
    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, phone, or summary..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex space-x-2">
                <select
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium text-gray-700 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="Completd">Completed</option>
                    <option value="Callback Scheduled">Callback Scheduled</option>
                    <option value="Failed">Failed</option>
                </select>
                <button className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-dashed">
                    <Filter className="h-4 w-4" />
                    <span>More Filters</span>
                </button>
            </div>
        </div>
    );
};
