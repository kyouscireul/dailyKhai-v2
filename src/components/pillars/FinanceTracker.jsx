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
            expenses: [newExpense, ...prev.expenses]
        }));
        setSpendingAmount('');
        setSpendingRemark('');
    };

    const undoLastExpense = () => {
        if (state.expenses.length === 0) return;
        const lastExpense = state.expenses[0];

        setState(prev => ({
            ...prev,
            weeklySpent: prev.weeklySpent - lastExpense.amount,
            expenses: prev.expenses.slice(1)
        }));
    };

    const resetWeek = () => {
        if (confirm('Start a new week? This will reset your spending to RM 0.')) {
            setState(prev => ({ ...prev, weeklySpent: 0, expenses: [] }));
        }
    };

    // Derived Values
    const remaining = state.weeklyLimit - state.weeklySpent;
    const saveTarget = state.weeklySaveTarget || 0;
    const progress = Math.min((state.weeklySpent / state.weeklyLimit) * 100, 100);

    // Status Logic
    const isSafe = remaining >= saveTarget;
    const isDanger = remaining < saveTarget && remaining > 0;
    const isBroke = remaining <= 0;

    return (
        <div className="mt-6 space-y-5">
            {/* Top Dashboard */}
            <div className={`rounded-3xl p-5 text-white shadow-lg transition-all duration-500 relative overflow-hidden flex flex-col justify-between
                ${isBroke ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-200'
                    : isDanger ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-200'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200'}`} style={{ minHeight: '160px' }}>

                {/* Header: Total Savings */}
                <div className="flex items-center gap-2 opacity-90">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Wallet size={12} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">Total Savings</p>
                        <p className="text-xs font-black tracking-wide leading-none">RM {state.totalSavings.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="ml-auto text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-all"
                    >
                        <Settings size={14} />
                    </button>
                </div>

                {/* Main Balance Display - Centered vertically in available space */}
                <div className="flex-1 flex flex-col justify-center py-2">
                    <span className="text-emerald-100 text-[9px] font-bold uppercase tracking-wider block mb-1.5 opacity-90">Available / Target</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-medium opacity-80">RM</span>
                        <h1 className="text-4xl font-black tracking-tight">{remaining.toFixed(0)}</h1>
                        <span className="text-xl font-medium opacity-60">/ {saveTarget}</span>
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
                <div className="bg-white border border-slate-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider">Configuration</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Weekly Limit</label>
                            <input
                                type="number"
                                value={state.weeklyLimit}
                                onChange={(e) => updateSetting('weeklyLimit', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Save Target</label>
                            <input
                                type="number"
                                value={state.weeklySaveTarget}
                                onChange={(e) => updateSetting('weeklySaveTarget', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Total Savings</label>
                            <input
                                type="number"
                                value={state.totalSavings}
                                onChange={(e) => updateSetting('totalSavings', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Spend Zone */}
            <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <ArrowDown size={16} className="text-red-500" />
                    New Expense
                </h3>

                {/* Remark Input */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Remark</label>
                    <input
                        type="text"
                        value={spendingRemark}
                        onChange={(e) => setSpendingRemark(e.target.value)}
                        placeholder="What is this for?"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-300"
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
                                className="h-12 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-red-100 hover:bg-red-50 hover:shadow-md active:scale-95 transition-all flex flex-col items-center justify-center group"
                            >
                                <span className="text-xs font-black text-slate-700 group-hover:text-red-600 leading-none">RM {amt}</span>
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
                                className="w-full bg-slate-100 border-0 rounded-xl pl-10 pr-4 py-3 text-lg font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-red-100 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button
                            onClick={() => addExpense(spendingAmount)}
                            disabled={!spendingAmount}
                            className="bg-slate-800 text-white px-5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
                        >
                            Spend
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent History */}
            <div className="pt-4 border-t border-slate-100">
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
                            className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    {state.expenses.length === 0 ? (
                        <p className="text-center text-slate-300 text-xs py-2 italic">No spending yet this week.</p>
                    ) : (
                        state.expenses.slice(0, 50).map(expense => (
                            <div key={expense.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                        <DollarSign size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">{expense.remark}</span>
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {new Date(expense.date).toLocaleDateString()} • {new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-red-500 text-sm font-black">- RM {expense.amount.toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinanceTracker;
