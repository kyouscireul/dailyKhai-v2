import React, { useState, useEffect } from 'react';
import { Check, GraduationCap } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const AcademicTracker = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAcademicData();
    }, []);

    const fetchAcademicData = async () => {
        try {
            const { data, error } = await supabase
                .from('academic_subjects')
                .select(`
                    *,
                    academic_assessments (
                        *
                    )
                `)
                .order('name');
            // Note: You might want a specific order column later

            if (error) throw error;

            // sort assessments by name or created_at if needed, currently just DB order
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching academic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAssessment = async (assessment) => {
        // Optimistic UI Update
        setSubjects(prevSubjects =>
            prevSubjects.map(subj => ({
                ...subj,
                academic_assessments: subj.academic_assessments.map(a =>
                    a.id === assessment.id ? { ...a, is_completed: !a.is_completed } : a
                )
            }))
        );

        try {
            const { error } = await supabase
                .from('academic_assessments')
                .update({ is_completed: !assessment.is_completed })
                .eq('id', assessment.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling assessment:', error);
            // Revert on error
            setSubjects(prevSubjects =>
                prevSubjects.map(subj => ({
                    ...subj,
                    academic_assessments: subj.academic_assessments.map(a =>
                        a.id === assessment.id ? { ...a, is_completed: assessment.is_completed } : a
                    )
                }))
            );
        }
    };

    const calculateSubjectProgress = (subject) => {
        let totalWeight = 0;
        let earnedWeight = 0;

        subject.academic_assessments.forEach(assess => {
            totalWeight += assess.weight;
            if (assess.is_completed) {
                earnedWeight += assess.weight;
            }
        });

        return { earned: earnedWeight, total: totalWeight };
    };

    const calculateTotalProgress = () => {
        let totalPossible = 0;
        let totalEarned = 0;

        subjects.forEach(subject => {
            const { earned, total } = calculateSubjectProgress(subject);
            totalPossible += total;
            totalEarned += earned;
        });

        // Avoid division by zero
        if (totalPossible === 0) return 0;
        return Math.round((totalEarned / totalPossible) * 100);
    };

    const totalProgress = calculateTotalProgress();

    // Color mapping for Tailwind classes (Extended with dark mode variants)
    const colorStyles = {
        indigo: {
            bg: 'bg-indigo-50 dark:bg-indigo-950/30',
            text: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-100 dark:border-indigo-900/50',
            bar: 'bg-indigo-500 dark:bg-indigo-400',
            lightBg: 'bg-indigo-50/50 dark:bg-indigo-900/20',
            check: 'bg-indigo-500 border-indigo-500 dark:bg-indigo-400 dark:border-indigo-400',
            hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
            active: 'bg-indigo-50/50 dark:bg-indigo-900/10'
        },
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
            text: 'text-emerald-700 dark:text-emerald-300',
            border: 'border-emerald-100 dark:border-emerald-900/50',
            bar: 'bg-emerald-500 dark:bg-emerald-400',
            lightBg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
            check: 'bg-emerald-500 border-emerald-500 dark:bg-emerald-400 dark:border-emerald-400',
            hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
            active: 'bg-emerald-50/50 dark:bg-emerald-900/10'
        },
        violet: {
            bg: 'bg-violet-50 dark:bg-violet-950/30',
            text: 'text-violet-700 dark:text-violet-300',
            border: 'border-violet-100 dark:border-violet-900/50',
            bar: 'bg-violet-500 dark:bg-violet-400',
            lightBg: 'bg-violet-50/50 dark:bg-violet-900/20',
            check: 'bg-violet-500 border-violet-500 dark:bg-violet-400 dark:border-violet-400',
            hover: 'hover:bg-violet-50 dark:hover:bg-violet-900/20',
            active: 'bg-violet-50/50 dark:bg-violet-900/10'
        },
        rose: {
            bg: 'bg-rose-50 dark:bg-rose-950/30',
            text: 'text-rose-700 dark:text-rose-300',
            border: 'border-rose-100 dark:border-rose-900/50',
            bar: 'bg-rose-500 dark:bg-rose-400',
            lightBg: 'bg-rose-50/50 dark:bg-rose-900/20',
            check: 'bg-rose-500 border-rose-500 dark:bg-rose-400 dark:border-rose-400',
            hover: 'hover:bg-rose-50 dark:hover:bg-rose-900/20',
            active: 'bg-rose-50/50 dark:bg-rose-900/10'
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-950/30',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-100 dark:border-amber-900/50',
            bar: 'bg-amber-500 dark:bg-amber-400',
            lightBg: 'bg-amber-50/50 dark:bg-amber-900/20',
            check: 'bg-amber-500 border-amber-500 dark:bg-amber-400 dark:border-amber-400',
            hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
            active: 'bg-amber-50/50 dark:bg-amber-900/10'
        },
        sky: {
            bg: 'bg-sky-50 dark:bg-sky-950/30',
            text: 'text-sky-700 dark:text-sky-300',
            border: 'border-sky-100 dark:border-sky-900/50',
            bar: 'bg-sky-500 dark:bg-sky-400',
            lightBg: 'bg-sky-50/50 dark:bg-sky-900/20',
            check: 'bg-sky-500 border-sky-500 dark:bg-sky-400 dark:border-sky-400',
            hover: 'hover:bg-sky-50 dark:hover:bg-sky-900/20',
            active: 'bg-sky-50/50 dark:bg-sky-900/10'
        },
        pink: {
            bg: 'bg-pink-50 dark:bg-pink-950/30',
            text: 'text-pink-700 dark:text-pink-300',
            border: 'border-pink-100 dark:border-pink-900/50',
            bar: 'bg-pink-500 dark:bg-pink-400',
            lightBg: 'bg-pink-50/50 dark:bg-pink-900/20',
            check: 'bg-pink-500 border-pink-500 dark:bg-pink-400 dark:border-pink-400',
            hover: 'hover:bg-pink-50 dark:hover:bg-pink-900/20',
            active: 'bg-pink-50/50 dark:bg-pink-900/10'
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-950/30',
            text: 'text-blue-700 dark:text-blue-300',
            border: 'border-blue-100 dark:border-blue-900/50',
            bar: 'bg-blue-500 dark:bg-blue-400',
            lightBg: 'bg-blue-50/50 dark:bg-blue-900/20',
            check: 'bg-blue-500 border-blue-500 dark:bg-blue-400 dark:border-blue-400',
            hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
            active: 'bg-blue-50/50 dark:bg-blue-900/10'
        },
    };

    if (loading) {
        return <div className="text-center py-10 text-slate-400">Loading academic data...</div>;
    }

    return (
        <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2 transition-colors">
                    <GraduationCap size={20} className="text-blue-600" />
                    Semester 5 Tracker
                </h3>
            </div>

            {/* Main Progress Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Total Carry Marks</p>
                        <h2 className="text-4xl font-black tracking-tighter">{totalProgress}%</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-100 text-xs font-medium">Keep pushing!</p>
                    </div>
                </div>
                <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${totalProgress}%` }}
                    />
                </div>
            </div>

            {subjects.map(subject => {
                const { earned, total } = calculateSubjectProgress(subject);
                const styles = colorStyles[subject.color] || colorStyles.blue;

                return (
                    <div key={subject.id} className={`bg-white dark:bg-slate-900 rounded-2xl border ${styles.border} shadow-sm overflow-hidden transition-colors duration-300`}>
                        <div className={`${styles.lightBg} px-4 py-3 border-b ${styles.border} flex justify-between items-center transition-colors`}>
                            <h4 className={`font-bold ${styles.text} transition-colors`}>{subject.name}</h4>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                                {earned}% / {total}%
                            </span>
                        </div>

                        <div className="p-2">
                            {subject.academic_assessments.map(assess => {
                                const isDone = assess.is_completed;
                                const isLeading = assess.is_leading;

                                return (
                                    <div
                                        key={assess.id}
                                        onClick={() => toggleAssessment(assess)}
                                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all select-none relative overflow-hidden
                                            ${isDone ? styles.active + ' opacity-75' : styles.hover}
                                            ${isLeading ? 'border border-red-100 dark:border-red-900/50 bg-red-50/30' : ''}`}
                                    >
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${isDone ? styles.check + ' text-white' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                            {isDone && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start pr-8">
                                                <span className={`text-sm font-medium transition-colors ${isDone ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-700 dark:text-slate-200'} ${isLeading ? 'text-red-800 dark:text-red-300' : ''}`}>
                                                    {assess.name}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-2 whitespace-nowrap">{assess.weight}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Progress Bar inside card */}
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 w-full transition-colors">
                            <div
                                className={`h-full ${styles.bar} transition-all duration-500`}
                                style={{ width: `${Math.min(100, (earned / total) * 100)}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AcademicTracker;
