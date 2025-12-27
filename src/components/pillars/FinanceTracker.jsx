import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, ArrowDown, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import { useUser } from '../../context/UserContext';

const FinanceTracker = () => {
    const { user } = useUser();

    // Initial State Loading
    const [config, setConfig] = useState({
        total_savings: 0,
        weekly_limit: 100,
        weekly_save_target: 50
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [spendingAmount, setSpendingAmount] = useState('');
    const [spendingRemark, setSpendingRemark] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Fetch Data
    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Get Config
            let { data: configData, error: configError } = await supabase
                .from('finance_config')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (configError && configError.code === 'PGRST116') {
                // No row found, create one
                const { data: newConfig, error: createError } = await supabase
                    .from('finance_config')
                    .insert([{
                        user_id: user.id,
                        total_savings: 1000,
                        weekly_limit: 500,
                        weekly_save_target: 50
                    }])
                    .select()
                    .single();
                if (createError) throw createError;
                configData = newConfig;
            } else if (configError) throw configError;

            setConfig(configData);

            // 2. Get Active Transactions
            const { data: transData, error: transError } = await supabase
                .from('finance_transactions')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (transError) throw transError;
            setTransactions(transData);

        } catch (error) {
            console.error("Error loading finance data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const updateSetting = async (key, value) => {
        const numValue = Number(value);
        // Optimistic
        setConfig(prev => ({ ...prev, [key]: numValue }));

        try {
            await supabase
                .from('finance_config')
                .update({ [key]: numValue })
                .eq('id', config.id);
        } catch (error) {
            console.error("Error updating config:", error);
        }
    };

    const addExpense = async (amount) => {
        const value = Number(amount);
        if (!value || value <= 0) return;

        const remark = spendingRemark.trim() || "Expense";

        // Optimistic
        const tempId = Date.now().toString(); // temp ID
        const newTx = {
            id: tempId,
            amount: value,
            remark: remark,
            created_at: new Date().toISOString(),
            is_active: true
        };
        setTransactions(prev => [newTx, ...prev]);
        setSpendingAmount('');
        setSpendingRemark('');

        try {
            const { data, error } = await supabase
                .from('finance_transactions')
                .insert([{
                    user_id: user.id,
                    amount: value,
                    remark: remark
                }])
                .select()
                .single();

            if (error) throw error;

            // Replace temp ID with real ID
            setTransactions(prev => prev.map(t => t.id === tempId ? data : t));

        } catch (error) {
            console.error("Error adding expense:", error);
            // Revert
            setTransactions(prev => prev.filter(t => t.id !== tempId));
        }
    };

    const undoLastExpense = async () => {
        if (transactions.length === 0) return;
        const lastTx = transactions[0];

        // Optimistic
        setTransactions(prev => prev.slice(1));

        try {
            await supabase
                .from('finance_transactions')
                .delete()
                .eq('id', lastTx.id);
        } catch (error) {
            console.error("Error deleting expense:", error);
            // Revert (fetch again to be safe)
            fetchData();
        }
    };

    const resetWeek = async () => {
        if (confirm('Start a new week? This will archive your spending.')) {
            // Optimistic
            setTransactions([]);
            setCurrentPage(1);

            try {
                // Archive all active transactions
                await supabase
                    .from('finance_transactions')
                    .update({ is_active: false })
                    .eq('is_active', true);
            } catch (error) {
                console.error("Error resetting week:", error);
                fetchData();
            }
        }
    };

    // Derived Values
    const weeklySpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const weeklyLimit = config.weekly_limit || 100;
    const saveTarget = config.weekly_save_target || 0;
    const remaining = weeklyLimit - weeklySpent;
    const progress = Math.min((weeklySpent / weeklyLimit) * 100, 100);

    // Status Logic
    const isDanger = remaining < saveTarget && remaining > 0;
    const isBroke = remaining <= 0;

    if (loading) return <div className="text-center py-10 text-slate-400">Loading wallet...</div>;

    return (
        <div className="mt-6 space-y-5">
            {/* Top Dashboard */}
            <div className={`rounded-3xl p-5 text-white shadow-lg transition-all duration-500 relative overflow-hidden flex flex-col justify-between
                ${isBroke ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-200 dark:shadow-red-900/30'
                    : isDanger ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-200 dark:shadow-orange-900/30'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200 dark:shadow-emerald-900/30'}`} style={{ minHeight: '160px' }}>

                {/* Header: Initial / Current / Target */}
                <div className="flex items-center gap-2 opacity-90">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Wallet size={12} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none mb-0.5">Balance</p>
                        <p className="text-xs font-black tracking-wide leading-none">RM {Number(config.total_savings).toFixed(2)}</p>
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
                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-wider block mb-0.5">Weekly Available</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-medium opacity-80">RM</span>
                        <h1 className="text-5xl font-black tracking-tight leading-none filter drop-shadow-sm">{remaining.toFixed(0)}</h1>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                            <span className="text-[9px] uppercase font-bold tracking-wide opacity-70">Limit</span>
                            <span className="text-xs font-bold text-white">RM {weeklyLimit}</span>
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
                                value={config.weekly_limit}
                                onChange={(e) => updateSetting('weekly_limit', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Save Target</label>
                            <input
                                type="number"
                                value={config.weekly_save_target}
                                onChange={(e) => updateSetting('weekly_save_target', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-bold text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Balance</label>
                            <input
                                type="number"
                                value={config.total_savings}
                                onChange={(e) => updateSetting('total_savings', e.target.value)}
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
                        {transactions.length > 0 && (
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
                    {transactions.length === 0 ? (
                        <p className="text-center text-slate-300 text-xs py-10 italic">No spending yet this week.</p>
                    ) : (
                        transactions.slice((currentPage - 1) * 5, currentPage * 5).map(expense => (
                            <div key={expense.id} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                                        <DollarSign size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{expense.remark}</span>
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            {new Date(expense.created_at).toLocaleDateString()} • {new Date(expense.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-red-500 dark:text-red-400 text-sm font-black">- RM {Number(expense.amount).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                {transactions.length > 5 && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold disabled:opacity-50 transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-xs font-bold text-slate-400 py-1">
                            Page {currentPage} of {Math.ceil(transactions.length / 5)}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(Math.ceil(transactions.length / 5), p + 1))}
                            disabled={currentPage >= Math.ceil(transactions.length / 5)}
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
