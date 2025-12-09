import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListTodo, Award } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    const isRoutine = location.pathname === '/';
    const isGoals = location.pathname === '/goals';

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-2 z-50 pb-safe" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="max-w-md mx-auto flex justify-around">
                <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isRoutine ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600'}`}>
                    <ListTodo size={24} />
                    <span className="text-[10px] font-bold mt-1">ROUTINE</span>
                </Link>
                <Link to="/goals" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isGoals ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600'}`}>
                    <Award size={24} />
                    <span className="text-[10px] font-bold mt-1">GOALS</span>
                </Link>
            </div>
        </div>
    );
};

export default Footer;
