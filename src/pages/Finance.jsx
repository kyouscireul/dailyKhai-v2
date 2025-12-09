import React from 'react';
import FinanceTracker from '../components/pillars/FinanceTracker';
import Footer from '../components/Footer';

const Finance = () => {
    return (
        <div className="min-h-screen font-sans pb-24 bg-slate-50 select-none">
            <div className="bg-white shadow-sm sticky top-0 z-10" style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}>
                <div className="max-w-md mx-auto px-4 pt-2 pb-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Financial Tracker</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage your wealth</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4">
                <FinanceTracker />
            </div>
            <Footer />
        </div>
    );
};

export default Finance;
