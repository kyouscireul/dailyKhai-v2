import React from 'react';
import { CheckCircle, Circle, Trash2, Plus, Edit2 } from 'lucide-react';


const Section = ({ title, icon: Icon, colorClass, dataKey, items, onToggle, isEditing, onEdit, onDelete, onAdd }) => (
    <div className="mb-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className={`px-4 py-3 ${colorClass} flex items-center gap-2`}>
            <Icon size={18} className="text-slate-700/80" />
            <h3 className="font-bold text-slate-700/80 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-2">
            {items.map(task => (
                <div
                    key={task.id}
                    onClick={() => !isEditing && onToggle(dataKey, task.id)}
                    className={`flex items-start gap-3 p-3 mb-1 rounded-xl transition-all duration-200 border 
                        ${isEditing
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-default'
                            : task.completed
                                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-pointer'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md cursor-pointer'
                        }`}
                >
                    <div className={`mt-1 ${task.completed ? 'text-green-500' : 'text-slate-300'}`}>
                        {isEditing ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(dataKey, task); }}
                                className="text-blue-400 hover:text-blue-600"
                            >
                                <Edit2 size={18} />
                            </button>
                        ) : (
                            task.completed ? <CheckCircle size={22} fill="currentColor" className="text-white dark:text-slate-900" /> : <Circle size={22} className="dark:text-slate-600" />
                        )}
                    </div>

                    <div className="flex-1">
                        <p className={`font-medium text-slate-800 dark:text-slate-200 ${task.completed && !isEditing ? 'line-through text-slate-500 dark:text-slate-600' : ''} transition-colors`}>{task.text}</p>
                        {task.subtext && <p className={`text-xs mt-0.5 ${task.type === 'grind' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-500'}`}>{task.subtext}</p>}
                    </div>

                    <div className="opacity-90 flex items-center gap-2">
                        {isEditing && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(dataKey, task.id); }}
                                className="text-red-300 hover:text-red-500 p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {isEditing && (
                <button
                    onClick={() => onAdd(dataKey)}
                    className="w-full py-3 mt-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-bold text-xs uppercase tracking-wider"
                >
                    <Plus size={16} /> Add Task
                </button>
            )}
        </div>
    </div>
);

export default Section;
