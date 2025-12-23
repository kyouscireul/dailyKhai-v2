import React from 'react';

const GoalCard = ({ label, value, inputValue, max, unit, onInputChange }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-3 transition-colors duration-300">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-200 transition-colors">{label}</span>
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                <span className="text-xs font-bold text-slate-400">{unit}</span>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="w-20 text-right font-bold text-slate-700 dark:text-slate-100 bg-transparent outline-none p-0 m-0 transition-colors"
                    inputMode="numeric"
                />
                {max && <span className="text-xs font-medium text-slate-400 ml-1">/ {max}</span>}
            </div>
        </div>
        {max && (
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2 relative transition-colors">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
            </div>
        )}
    </div>
);

export default GoalCard;
