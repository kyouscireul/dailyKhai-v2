import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

import { useUser } from '../../context/UserContext';

const FocusQueue = () => {
    const { user } = useUser();
    const [queue, setQueue] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setQueue(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const optimisiticTask = {
            id: Date.now(), // Temp ID
            content: inputValue.trim(),
            is_completed: false
        };

        // Optimistic update
        setQueue(prev => [...prev, optimisiticTask]);
        setInputValue('');

        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    user_id: user.id,
                    content: inputValue.trim()
                }])
                .select()
                .single();

            if (error) throw error;

            // Replace temp task with real data
            setQueue(prev => prev.map(t => t.id === optimisiticTask.id ? data : t));
        } catch (error) {
            console.error('Error adding task:', error);
            // Revert optimistic update on error
            setQueue(prev => prev.filter(t => t.id !== optimisiticTask.id));
        }
    };

    const toggleTask = async (task) => {
        // Optimistic update
        const updatedStatus = !task.is_completed;
        setQueue(prev => prev.map(t =>
            t.id === task.id ? { ...t, is_completed: updatedStatus } : t
        ));

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ is_completed: updatedStatus })
                .eq('id', task.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling task:', error);
            // Revert
            setQueue(prev => prev.map(t =>
                t.id === task.id ? { ...t, is_completed: !updatedStatus } : t
            ));
        }
    };

    const clearCompleted = async () => {
        if (!confirm('Clear all completed tasks?')) return;

        // Optimistic update
        const completedIds = queue.filter(t => t.is_completed).map(t => t.id);
        setQueue(prev => prev.filter(t => !t.is_completed));

        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .in('id', completedIds);

            if (error) throw error;
        } catch (error) {
            console.error('Error clearing tasks:', error);
            fetchTasks(); // Reload on error
        }
    };

    const hasCompletedTasks = queue.some(t => t.is_completed);

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight transition-colors">Tactical Queue</h3>
                    <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800 transition-colors">Focus Mode</span>
                </div>
                {hasCompletedTasks && (
                    <button
                        onClick={clearCompleted}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl px-5 py-5 pr-14 text-slate-700 dark:text-slate-200 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-50/50 dark:focus:ring-indigo-900/30 focus:shadow-lg transition-all shadow-inner dark:shadow-none"
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
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
                        <p className="text-slate-400 text-sm font-medium">Clear mind. Ready to engage.</p>
                    </div>
                )}

                {queue.map(task => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`group flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm transition-all cursor-pointer select-none active:scale-[0.99]
                            ${task.completed
                                ? 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-75'
                                : 'border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-md'
                            }`}
                    >
                        <span className={`font-semibold flex-1 leading-snug transition-all ${task.completed ? 'text-slate-400 line-through decoration-2 decoration-slate-300 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200'}`}>
                            {task.content}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FocusQueue;
