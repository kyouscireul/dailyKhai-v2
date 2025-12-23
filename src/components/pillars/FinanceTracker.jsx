import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, ArrowDown, TrendingUp, DollarSign, Wallet } from 'lucide-react';

const FinanceTracker = () => {
    // Initial State Loading
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('khai_finance_tracker');
        return saved ? JSON.parse(saved) : {
            totalSavings: 1000,
            monthlyBudget: 500,
            weeklyLimit: 100,
            weeklySaveTarget: 50,
            weeklySpent: 0,

            expenses: []
        };
    });

    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingRemark, setSpendingRemark] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Persistence
    useEffect(() => {
        localStorage.setItem('khai_finance_tracker', JSON.stringify(state));
    }, [state]);

    // Actions
    const updateSetting = (key, value) => {
        setState(prev => ({ ...prev, [key]: Number(value) }));
    };

    const addExpense = (amount) => {
        const value = Number(amount);
        if (!value || value <= 0) return;

        const newExpense = {
            id: Date.now(),
            amount: value,
            remark: spendingRemark.trim() || "Expense",
            date: new Date().toISOString()
        };

        setState(prev => ({
            ...prev,
            weeklySpent: prev.weeklySpent + value,
            expenses: [newExpense, ...prev.expenses].slice(0, 50)
        }));
        setSpendingAmount('');
        setSpendingRemark('');
    };

    const undoLastExpense = () => {
        if (state.expenses.length === 0) return;
        const lastExpense = state.expenses[0];
        const updatedExpenses = state.expenses.slice(1);

        setState(prev => ({
            ...prev,
            weeklySpent: prev.weeklySpent - lastExpense.amount,
            expenses: updatedExpenses
        }));

        // Auto-navigate back if page becomes empty
        const totalPages = Math.ceil(updatedExpenses.length / 5);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            setCurrentPage(1); // Reset to 1 if empty
        }
    };

    const resetWeek = () => {
        if (confirm('Start a new week? This will reset your spending to RM 0.')) {
            setState(prev => ({ ...prev, weeklySpent: 0, expenses: [] }));
            setCurrentPage(1);
        }
    };

    // Derived Values
    const remaining = state.weeklyLimit - state.weeklySpent;
    const saveTarget = state.weeklySaveTarget || 0;
    const progress = Math.min((state.weeklySpent / state.weeklyLimit) * 100, 100);

    // Status Logic

    const isDanger = remaining < saveTarget && remaining > 0;
    const isBroke = remaining <= 0;

    return (
        <div className="mt-6 space-y-5">
            {/* Top Dashboard */}
            <div className={`rounded-3xl p-5 text-white shadow-lg transition-all duration-500 relative overflow-hidden flex flex-col justify-between
                ${isBroke ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-200'
                    : isDanger ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-200'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200'}`} style={{ minHeight: '160px' }}>

                {/* Header: Initial / Current / Target */}
                <div className="flex items-center gap-2 opacity-90">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Wallet size={12} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">Balance</p>
                        <p className="text-xs font-black tracking-wide leading-none">RM {state.totalSavings.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="ml-auto text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-all"
                    >
                        <Settings size={14} />
                    </button>
                </div>

                {/* Main Balance Display */}
                <div className="flex-1 flex flex-col justify-center items-start py-2">
                    <span className="text-emerald-100 text-[9px] font-bold uppercase tracking-wider block mb-0.5 opacity-90">Weekly Available</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-medium opacity-80">RM</span>
                        <h1 className="text-5xl font-black tracking-tight leading-none filter drop-shadow-sm">{remaining.toFixed(0)}</h1>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                            <span className="text-[9px] uppercase font-bold tracking-wide opacity-70">Start</span>
                            <span className="text-xs font-bold text-white">RM {state.weeklyLimit}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                            <span className="text-[9px] uppercase font-bold tracking-wide opacity-70">Target</span>
                            <span className="text-xs font-bold text-white">RM {saveTarget}</span>
                        </div>
                    </div>
                </div>

                {/* Status Bar - Bottom Anchor */}
                <div className="mt-auto flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/90 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">{Math.round(progress)}% Spent</span>
                </div>
            </div>

            {/* Settings Panel (Collapsible) */}
            {showSettings && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 transition-colors">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-xs uppercase tracking-wider">Configuration</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Weekly Limit</label>
                            <input
                                type="number"
                                value={state.weeklyLimit}
                                onChange={(e) => updateSetting('weeklyLimit', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Save Target</label>
                            <input
                                type="number"
                                value={state.weeklySaveTarget}
                                onChange={(e) => updateSetting('weeklySaveTarget', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Balance</label>
                            <input
                                type="number"
                                value={state.totalSavings}
                                onChange={(e) => updateSetting('totalSavings', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Spend Zone */}
            <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2 transition-colors">
                    <ArrowDown size={16} className="text-red-500" />
                    New Expense
                </h3>

                {/* Remark Input */}
                <div>
                    <input
                        type="text"
                        value={spendingRemark}
                        onChange={(e) => setSpendingRemark(e.target.value)}
                        placeholder="Spending Remark"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
                    />
                </div>

                {/* Quick Chips */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Quick Select</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 20, 50].map(amt => (
                            <button
                                key={amt}
                                onClick={() => addExpense(amt)}
                                className="h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-red-100 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md active:scale-95 transition-all flex flex-col items-center justify-center group"
                            >
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 leading-none transition-colors">RM {amt}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Manual Input */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Custom Amount</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">RM</span>
                            <input
                                type="number"
                                value={spendingAmount}
                                onChange={(e) => setSpendingAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            onClick={() => addExpense(spendingAmount)}
                            disabled={!spendingAmount}
                            className="bg-slate-800 dark:bg-slate-700 text-white px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-slate-200 dark:shadow-none hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all border-b-4 border-slate-900 dark:border-slate-800 active:border-b-0 active:translate-y-1"
                        >
                            Spend
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent History */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Recent Activity</h4>
                    <div className="flex gap-2">
                        {state.expenses.length > 0 && (
                            <button
                                onClick={undoLastExpense}
                                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                            >
                                <RotateCcw size={10} /> Undo
                            </button>
                        )}


                        <button
                            onClick={resetWeek}
                            className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5 min-h-[320px]">
                    {state.expenses.length === 0 ? (
                        <p className="text-center text-slate-300 text-xs py-10 italic">No spending yet this week.</p>
                    ) : (
                        state.expenses.slice((currentPage - 1) * 5, currentPage * 5).map(expense => (
                            <div key={expense.id} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                                        <DollarSign size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{expense.remark}</span>
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            {new Date(expense.date).toLocaleDateString()} • {new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-red-500 dark:text-red-400 text-sm font-black">- RM {expense.amount.toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                {state.expenses.length > 5 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold disabled:opacity-50 transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs font-bold text-slate-400 py-1">
                            Page {currentPage} of {Math.ceil(state.expenses.length / 5)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(state.expenses.length / 5), p + 1))}
                            disabled={currentPage >= Math.ceil(state.expenses.length / 5)}
                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceTracker;
