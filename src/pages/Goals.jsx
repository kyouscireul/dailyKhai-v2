import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Layers, Pencil, Check } from 'lucide-react';
import GoalCard from '../components/GoalCard';
import SkillSlider from '../components/SkillSlider';
import Footer from '../components/Footer';

const Goals = () => {
    const defaultGoals = { savings: 0, savingsTarget: 5000, skills: { frontend: 20, backend: 10, ai: 15 } };
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [goals, setGoals] = useState(defaultGoals);

    const [savingInput, setSavingInput] = useState(String(defaultGoals.savings));
    const [isSkillEditing, setIsSkillEditing] = useState(false);

    // Fetch User & Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    const { data: progress } = await supabase
                        .from('user_progress')
                        .select('goals_data')
                        .eq('id', user.id)
                        .single();

                    if (progress && progress.goals_data) {
                        // Merge with defaults to ensure structure
                        setGoals(prev => ({
                            ...prev,
                            ...progress.goals_data,
                            skills: { ...prev.skills, ...(progress.goals_data.skills || {}) }
                        }));
                        if (progress.goals_data.savings) setSavingInput(String(progress.goals_data.savings));
                    }
                }
            } catch (error) {
                console.error("Error loading goals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Save Helper
    const saveGoals = async (newGoals) => {
        setGoals(newGoals); // Optimistic Update
        if (!user) return;

        try {
            await supabase.from('user_progress').update({ goals_data: newGoals }).eq('id', user.id);
        } catch (error) {
            console.error("Error saving goals:", error);
        }
    };

    const updateSkill = (key, value) => {
        const cleanValue = Math.min(100, Math.max(0, parseInt(value) || 0));
        const newGoals = { ...goals, skills: { ...goals.skills, [key]: cleanValue } };
        saveGoals(newGoals);
    };

    const handleSavingChange = (val) => {
        setSavingInput(val);
        if (val === '') return;
        const num = parseInt(val);
        if (!isNaN(num)) {
            const newGoals = { ...goals, savings: num };
            saveGoals(newGoals); // Debounce might be better here but keeping it simple
        }
    };

    const [pillars, setPillars] = useState([]);
    const [loadingPillars, setLoadingPillars] = useState(true);

    useEffect(() => {
        const fetchPillars = async () => {
            try {
                // Check if pillars table exists or fallback to static list if needed
                // For now, keeping existing logic but wrapping in try-catch
                const { data, error } = await supabase
                    .from('pillars')
                    .select('id, type, title')
                    .order('type');

                if (error) throw error;
                const formattedPillars = data.map(p => ({
                    id: p.type,
                    label: p.title,
                }));
                setPillars(formattedPillars);
            } catch (error) {
                console.warn('Error fetching pillars (table might not exist yet):', error);
                // Fallback to static pillars if DB fetch fails
                setPillars([
                    { id: 'finance', label: 'Finance' },
                    { id: 'health', label: 'Health' },
                    { id: 'wisdom', label: 'Wisdom' }
                ]);
            } finally {
                setLoadingPillars(false);
            }
        };

        fetchPillars();
    }, []);

    return (
        <div className="min-h-screen font-sans pb-24 bg-slate-50 dark:bg-slate-950 select-none transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-10 transition-colors duration-300" style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}>
                <div className="max-w-md mx-auto px-4 pt-2 pb-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">Goal Board</h1>
                        <p className="text-slate-500 text-sm font-medium">Vision & Progress</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-4 space-y-6">
                <div className="grid grid-cols-2 gap-2">
                    {loadingPillars ? (
                        <div className="col-span-2 text-center text-slate-400 py-4 text-sm">Loading pillars...</div>
                    ) : pillars.length > 0 ? (
                        pillars.map(pillar => (
                            <Link
                                key={pillar.id}
                                to={`/pillar/${pillar.id}`}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-center text-sm font-bold text-slate-600 dark:text-slate-400 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                            >
                                {pillar.label}
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-slate-400 py-4 text-sm">No pillars found.</div>
                    )}
                </div>

                <GoalCard
                    label="Saving Goal"
                    unit="RM "
                    value={goals.savings}
                    inputValue={savingInput}
                    max={goals.savingsTarget}
                    onInputChange={handleSavingChange}
                />

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 transition-colors">
                            <Layers size={16} /> Skill Progression
                        </h2>
                        <button
                            onClick={() => setIsSkillEditing(!isSkillEditing)}
                            className={`p-2 rounded-lg transition-all ${isSkillEditing ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            {isSkillEditing ? <Check size={18} /> : <Pencil size={18} />}
                        </button>
                    </div>

                    <SkillSlider
                        label="Front End Skill"
                        value={goals.skills.frontend}
                        onChange={(v) => updateSkill('frontend', v)}
                        disabled={!isSkillEditing}
                    />
                    <SkillSlider
                        label="Back End Skill"
                        value={goals.skills.backend}
                        onChange={(v) => updateSkill('backend', v)}
                        disabled={!isSkillEditing}
                    />
                    <SkillSlider
                        label="AI & Tools"
                        value={goals.skills.ai}
                        onChange={(v) => updateSkill('ai', v)}
                        disabled={!isSkillEditing}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Goals;
