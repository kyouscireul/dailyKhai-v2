import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

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
            completed: false,
            createdAt: new Date().toISOString()
        };

        setQueue(prev => [...prev, newTask]);
        setInputValue('');
    };

    const toggleTask = (id) => {
        setQueue(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const clearCompleted = () => {
        if (confirm('Clear all completed tasks?')) {
            setQueue(prev => prev.filter(task => !task.completed));
        }
    };

    const hasCompletedTasks = queue.some(t => t.completed);

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Tactical Queue</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100">Focus Mode</span>
                </div>
                {hasCompletedTasks && (
                    <button
                        onClick={clearCompleted}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear Completed"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <form onSubmit={addTask} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Next step?"
                    className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-5 pr-14 text-slate-700 font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:shadow-lg transition-all shadow-inner"
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
                        onClick={() => toggleTask(task.id)}
                        className={`group flex items-center gap-3 bg-white p-4 rounded-2xl border shadow-sm transition-all cursor-pointer select-none active:scale-[0.99]
                            ${task.completed
                                ? 'border-slate-100 bg-slate-50/50 opacity-75'
                                : 'border-slate-100 hover:border-indigo-100 hover:shadow-md'
                            }`}
                    >
                        <span className={`font-semibold flex-1 leading-snug transition-all ${task.completed ? 'text-slate-400 line-through decoration-2 decoration-slate-300' : 'text-slate-700'}`}>
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FocusQueue;
