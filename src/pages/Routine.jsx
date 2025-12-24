import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Sunset, Moon, RefreshCw, Download, Users, Flame, Briefcase, Edit, Check, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { defaultRoutines } from '../data/routineData';

const Routine = () => {
    const { theme, setTheme } = useTheme();
    const [level, setLevel] = useState(2);
    const [isEditing, setIsEditing] = useState(false);

    // Auth & Data State
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState('Khai');

    // Data Containers
    const [allRoutines, setAllRoutines] = useState(defaultRoutines); // Stores data for ALL levels
    const [tasks, setTasks] = useState(defaultRoutines[2]); // Current View

    const [levelData, setLevelData] = useState({
        1: { name: "Bare Minimum", goal: "Start small. Just show up." },
        2: { name: "Growth Mode", goal: "SOCIAL GOAL: Don't stay alone." },
        3: { name: "Monk Mode", goal: "HIGH DISCIPLINE: No Games." }
    });

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const navigate = useNavigate();

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    // Fetch Profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        if (profile.username) setUserName(profile.username);
                        if (profile.theme) setTheme(profile.theme);
                        if (profile.level_data) setLevelData(profile.level_data);
                    }

                    // Fetch Progress
                    const { data: progress } = await supabase
                        .from('user_progress')
                        .select('routine_data')
                        .eq('id', user.id)
                        .single();

                    if (progress && progress.routine_data && Object.keys(progress.routine_data).length > 0) {
                        setAllRoutines(progress.routine_data);
                        // We will set 'tasks' in the next useEffect when 'level' is stable
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 2. Sync Current View when Level or AllRoutines changes
    useEffect(() => {
        if (allRoutines[level]) {
            setTasks(allRoutines[level]);
        } else {
            setTasks(defaultRoutines[level]);
        }
    }, [level, allRoutines]);

    // 3. Save Routine Changes (Debounced ideally, but direct for now)
    // We need a way to update 'allRoutines' when 'tasks' changes, THEN save to DB.
    // However, 'tasks' changing triggers this.

    // Helper to save to DB
    const saveToSupabase = async (newAllRoutines) => {
        if (!user) return;
        try {
            await supabase
                .from('user_progress')
                .update({ routine_data: newAllRoutines })
                .eq('id', user.id);
        } catch (error) {
            console.error('Error saving routine:', error);
        }
    };

    // Update 'allRoutines' when 'tasks' changes (Local Sync)
    // AND Save to DB
    // WARNING: We must be careful not to create an infinite loop.
    // The flow should be: Interaction -> setTasks -> Update AllRoutines -> Save DB

    // actually, let's change the interaction handlers (toggleTask, etc.) to update AllRoutines directly.
    // That's cleaner than a useEffect loop.

    // 4. Save Profile Changes
    useEffect(() => {
        if (!user) return;
        const saveProfile = async () => {
            await supabase.from('profiles').update({ username: userName, level_data: levelData }).eq('id', user.id);
        };
        const timeout = setTimeout(saveProfile, 1000); // Debounce
        return () => clearTimeout(timeout);
    }, [userName, levelData, user]);

    // Theme Save
    useEffect(() => {
        if (!user) return;
        supabase.from('profiles').update({ theme }).eq('id', user.id);
    }, [theme, user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const updateRoutine = (newTasksForLevel) => {
        // 1. Update Local View
        setTasks(newTasksForLevel);

        // 2. Update Global State
        const newAllRoutines = { ...allRoutines, [level]: newTasksForLevel };
        setAllRoutines(newAllRoutines);

        // 3. Sync to DB
        saveToSupabase(newAllRoutines);
    };

    const toggleTask = (section, taskId) => {
        const newSectionData = tasks[section].map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
        const newTasks = { ...tasks, [section]: newSectionData };
        updateRoutine(newTasks);
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
            type: 'core'
        };

        const newTasks = {
            ...tasks,
            [section]: [...(tasks[section] || []), newTask]
        };
        updateRoutine(newTasks);
    };

    const editTask = (section, task) => {
        const newText = prompt("Task Name:", task.text);
        if (newText === null) return;
        const newSubtext = prompt("Subtext (optional):", task.subtext || "");

        const newTasks = {
            ...tasks,
            [section]: tasks[section].map(t => t.id === task.id ? { ...t, text: newText, subtext: newSubtext } : t)
        };
        updateRoutine(newTasks);
    };

    const deleteTask = (section, taskId) => {
        if (!confirm("Delete this task?")) return;
        const newTasks = {
            ...tasks,
            [section]: tasks[section].filter(t => t.id !== taskId)
        };
        updateRoutine(newTasks);
    };

    const resetDay = () => {
        if (confirm("Start a fresh day? This will uncheck all boxes.")) {
            const resetState = {};
            Object.keys(tasks).forEach(key => {
                if (Array.isArray(tasks[key])) { // Check if it's an array section
                    resetState[key] = tasks[key].map(t => ({ ...t, completed: false }));
                }
            });
            updateRoutine(resetState);
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
        <div className="min-h-screen font-sans pb-24 bg-slate-50 dark:bg-slate-950 select-none transition-colors duration-300">
            <div
                className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 border-b border-transparent dark:border-slate-800 transition-colors duration-300"
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
                                    className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-indigo-500 w-full transition-colors"
                                />
                            ) : (
                                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">{userName}'s Routine</h1>
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
                                onClick={handleLogout}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-red-500"
                                title="Log Out"
                            >
                                <LogOut size={18} />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-indigo-400"
                            >
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                {isEditing ? <Check size={18} /> : <Edit size={18} />}
                            </button>
                            <button onClick={resetDay} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                <RefreshCw size={18} className="text-slate-600 dark:text-slate-400" />
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

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4 transition-colors">
                        {[1, 2, 3].map(lvl => (
                            <button
                                key={lvl}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${level === lvl ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                onClick={() => setLevel(lvl)}
                            >
                                L{lvl}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
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

                {tasks.morning && <Section title={level > 1 ? "Early Morning" : "Morning"} icon={Sun} colorClass={level === 3 ? "bg-purple-100" : "bg-amber-100"} dataKey="morning" items={tasks.morning} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.work_block && <Section title="Work & Focus" icon={Briefcase} colorClass={level === 3 ? "bg-purple-100" : "bg-emerald-100"} dataKey="work_block" items={tasks.work_block} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.afternoon && <Section title="Afternoon" icon={CloudSun} colorClass={level === 3 ? "bg-purple-100" : "bg-sky-100"} dataKey="afternoon" items={tasks.afternoon} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.evening && <Section title="Evening" icon={Sunset} colorClass={level === 3 ? "bg-purple-100" : "bg-orange-100"} dataKey="evening" items={tasks.evening} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}
                {tasks.night && <Section title="Night" icon={Moon} colorClass={level === 3 ? "bg-purple-100" : "bg-indigo-100"} dataKey="night" items={tasks.night} onToggle={toggleTask} isEditing={isEditing} onAdd={addTask} onEdit={editTask} onDelete={deleteTask} />}

                <div className="text-center p-6 text-slate-400 dark:text-slate-600 text-xs transition-colors">
                    <p>{level === 1 ? '"Consistency > Intensity"' : level === 2 ? '"Environment shapes discipline."' : '"No excuses. Pure execution."'}</p>
                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Routine;
