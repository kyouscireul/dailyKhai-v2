import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListTodo, Award } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    const isRoutine = location.pathname === '/';
    const isGoals = location.pathname === '/goals';

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-50 pb-safe transition-colors duration-300" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="max-w-md mx-auto flex justify-around items-center">
                <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isRoutine ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                    <ListTodo size={24} />
                    <span className="text-[10px] font-bold mt-1">ROUTINE</span>
                </Link>


                <Link to="/goals" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isGoals ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                    <Award size={24} />
                    <span className="text-[10px] font-bold mt-1">GOALS</span>
                </Link>
            </div>
        </div>
    );
};

export default Footer;
