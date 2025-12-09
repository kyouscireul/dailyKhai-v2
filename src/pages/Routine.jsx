import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Sunset, Moon, RefreshCw, Download, Users, Flame, Briefcase, Edit, Check } from 'lucide-react';
import Section from '../components/Section';
import Footer from '../components/Footer';
import { defaultRoutines } from '../data/routineData';

const Routine = () => {
    const [level, setLevel] = useState(2);
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState(() => localStorage.getItem('khai_userName') || 'Entrepreneur');
    const [levelData, setLevelData] = useState(() => {
        const saved = localStorage.getItem('khai_level_data');
        return saved ? JSON.parse(saved) : {
            1: { name: "Business Mode", goal: "Execute. Delegated. Done." },
            2: { name: "Life Mode", goal: "Balance. Connection. Peace." },
            3: { name: "Health Mode", goal: "Vitality. Strength. Focus." }
        };
    });
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // Initialize tasks state
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(`khaiRoutine_v3_L${level}`);
        return saved ? JSON.parse(saved) : defaultRoutines[level];
    });

    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem(`khaiRoutine_v3_L${level}`);
        setTasks(saved ? JSON.parse(saved) : defaultRoutines[level]);
    }, [level]);

    useEffect(() => {
        localStorage.setItem(`khaiRoutine_v3_L${level}`, JSON.stringify(tasks));
    }, [tasks, level]);

    useEffect(() => {
        localStorage.setItem('khai_userName', userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem('khai_level_data', JSON.stringify(levelData));
    }, [levelData]);

    const toggleTask = (section, taskId) => {
        setTasks(prev => ({ ...prev, [section]: prev[section].map(task => task.id === taskId ? { ...task, completed: !task.completed } : task) }));
    };

    const addTask = (section) => {
        const text = prompt("Task Name:");
        if (!text) return;
        const subtext = prompt("Subtext (optional):");

        const newTask = {
            id: Date.now().toString(),
            text,
            subtext,
            completed: false,
            type: 'core' // Default type
        };

        setTasks(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), newTask]
        }));
    };

    const editTask = (section, task) => {
        const newText = prompt("Task Name:", task.text);
        if (newText === null) return; // Cancelled
        const newSubtext = prompt("Subtext (optional):", task.subtext || "");

        setTasks(prev => ({
            ...prev,
            [section]: prev[section].map(t => t.id === task.id ? { ...t, text: newText, subtext: newSubtext } : t)
        }));
    };

    const deleteTask = (section, taskId) => {
        if (!confirm("Delete this task?")) return;
        setTasks(prev => ({
            ...prev,
            [section]: prev[section].filter(t => t.id !== taskId)
        }));
    };

    const resetDay = () => {
        if (confirm("Start a fresh day? This will uncheck all boxes.")) {
            const resetState = {};
            Object.keys(tasks).forEach(key => { resetState[key] = tasks[key].map(t => ({ ...t, completed: false })); });
            setTasks(resetState);
        }
    };

    const calculateProgress = () => {
        let total = 0, completed = 0;
        if (tasks) {
            Object.values(tasks).forEach(section => {
                if (Array.isArray(section)) {
                    section.forEach(task => { total++; if (task.completed) completed++; });
                }
            });
        }
        return Math.round((completed / total) * 100) || 0;
    };

    const progress = calculateProgress();

    return (
        <div className="min-h-screen font-sans pb-24 bg-slate-50 select-none">
            <div
                className="bg-white shadow-sm sticky top-0 z-10"
                style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
            >
                <div className="max-w-md mx-auto px-5 pt-5 pb-2">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="text-2xl font-black text-slate-800 tracking-tight bg-slate-100 border-b-2 border-slate-300 focus:outline-none focus:border-indigo-500 w-full"
                                />
                            ) : (
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{userName}'s Routine</h1>
                            )}
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={levelData[level].name}
                                    onChange={(e) => setLevelData(prev => ({ ...prev, [level]: { ...prev[level], name: e.target.value } }))}
                                    className="text-slate-500 text-sm font-medium bg-slate-50 border-b border-slate-300 focus:outline-none w-full mt-1"
                                    placeholder="Level Name"
                                />
                            ) : (
                                <p className="text-slate-500 text-sm font-medium">{levelData[level].name}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isEditing ? <Check size={18} /> : <Edit size={18} />}
                            </button>
                            <button onClick={resetDay} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                <RefreshCw size={18} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                    {deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="w-full mb-3 bg-indigo-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-indigo-700 transition-colors"
                        >
                            <Download size={18} /> Install App
                        </button>
                    )}

                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        {[1, 2, 3].map(lvl => (
                            <button
                                key={lvl}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${level === lvl ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                onClick={() => setLevel(lvl)}
                            >
                                L{lvl}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ease-out ${level === 3 ? 'bg-purple-600' : level === 2 ? 'bg-indigo-500' : 'bg-blue-500'}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">{progress}%</span>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4 space-y-2">
                <div className={`mb-3 border rounded-lg p-2 flex items-center gap-2 text-xs font-bold ${level === 3 ? 'bg-purple-50 border-purple-100 text-purple-800' : level === 2 ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                    {level === 3 ? <Flame size={14} /> : level === 2 ? <Users size={14} /> : <Sun size={14} />}
                    {isEditing ? (
                        <input
                            type="text"
                            value={levelData[level].goal}
                            onChange={(e) => setLevelData(prev => ({ ...prev, [level]: { ...prev[level], goal: e.target.value } }))}
                            className="bg-transparent border-b border-black/10 focus:outline-none w-full"
                        />
                    ) : (
                        <span>{levelData[level].goal}</span>
                    )}
                </div>

                {tasks.morning && <Section title="Morning" icon={Sun} colorClass={level === 3 ? "bg-purple-100" : "bg-amber-100"} dataKey="morning" items={tasks.morning} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.afternoon && <Section title="Afternoon" icon={CloudSun} colorClass={level === 3 ? "bg-purple-100" : "bg-sky-100"} dataKey="afternoon" items={tasks.afternoon} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.evening && <Section title="Evening" icon={Sunset} colorClass={level === 3 ? "bg-purple-100" : "bg-orange-100"} dataKey="evening" items={tasks.evening} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.night && <Section title="Night" icon={Moon} colorClass={level === 3 ? "bg-purple-100" : "bg-indigo-100"} dataKey="night" items={tasks.night} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}

                <div className="text-center p-6 text-slate-400 text-xs">
                    <p>{level === 1 ? '"Success is scheduled."' : level === 2 ? '"Life is not a rehearsal."' : '"Health is wealth."'}</p>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Routine;
