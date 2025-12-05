import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

const FocusQueue = () => {
    const [queue, setQueue] = useState(() => {
        const saved = localStorage.getItem('khai_focus_queue');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        localStorage.setItem('khai_focus_queue', JSON.stringify(queue));
    }, [queue]);

    const addTask = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTask = {
            id: Date.now(),
            text: inputValue.trim(),
            createdAt: new Date().toISOString()
        };

        setQueue(prev => [...prev, newTask]);
        setInputValue('');
    };

    const completeTask = (id) => {
        setQueue(prev => prev.filter(task => task.id !== id));
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Tactical Queue</h3>
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">Focus Mode</span>
            </div>

            <form onSubmit={addTask} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What is the immediate next step?"
                    className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-4 pr-14 text-slate-700 font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:shadow-lg transition-all shadow-inner"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
            </form>

            <div className="space-y-3">
                {queue.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <p className="text-slate-400 text-sm font-medium">Clear mind. Ready to engage.</p>
                    </div>
                )}

                {queue.map(task => (
                    <div
                        key={task.id}
                        className="group flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all animate-in fade-in slide-in-from-bottom-2"
                    >
                        <button
                            onClick={() => completeTask(task.id)}
                            className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-slate-200 group-hover:border-emerald-400 flex items-center justify-center text-transparent group-hover:text-emerald-500 transition-all"
                        >
                            <Check size={14} strokeWidth={3} />
                        </button>
                        <span className="font-semibold text-slate-700 flex-1 leading-snug">{task.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FocusQueue;
