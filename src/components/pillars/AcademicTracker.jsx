import React, { useState, useEffect } from 'react';
import { Check, GraduationCap } from 'lucide-react';
import { academicData } from '../../data/academicData';

const AcademicTracker = () => {
    const [completed, setCompleted] = useState(() => {
        const saved = localStorage.getItem('khai_academic_tracker');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('khai_academic_tracker', JSON.stringify(completed));
    }, [completed]);

    const toggleAssessment = (subjectId, assessmentId) => {
        setCompleted(prev => {
            const key = `${subjectId}-${assessmentId}`;
            const newCompleted = { ...prev };
            if (newCompleted[key]) {
                delete newCompleted[key];
            } else {
                newCompleted[key] = true;
            }
            return newCompleted;
        });
    };

    const calculateSubjectProgress = (subject) => {
        let totalWeight = 0;
        let earnedWeight = 0;

        subject.assessments.forEach(assess => {
            totalWeight += assess.weight;
            if (completed[`${subject.id}-${assess.id}`]) {
                earnedWeight += assess.weight;
            }
        });

        return { earned: earnedWeight, total: totalWeight };
    };

    const calculateTotalProgress = () => {
        let totalPossible = 0;
        let totalEarned = 0;

        academicData.forEach(subject => {
            const { earned, total } = calculateSubjectProgress(subject);
            totalPossible += total;
            totalEarned += earned;
        });

        // Avoid division by zero
        if (totalPossible === 0) return 0;
        return Math.round((totalEarned / totalPossible) * 100);
    };

    const totalProgress = calculateTotalProgress();

    // Color mapping for Tailwind classes
    const colorStyles = {
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', bar: 'bg-indigo-500', lightBg: 'bg-indigo-50/50', check: 'bg-indigo-500 border-indigo-500' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', bar: 'bg-emerald-500', lightBg: 'bg-emerald-50/50', check: 'bg-emerald-500 border-emerald-500' },
        violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', bar: 'bg-violet-500', lightBg: 'bg-violet-50/50', check: 'bg-violet-500 border-violet-500' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', bar: 'bg-rose-500', lightBg: 'bg-rose-50/50', check: 'bg-rose-500 border-rose-500' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', bar: 'bg-amber-500', lightBg: 'bg-amber-50/50', check: 'bg-amber-500 border-amber-500' },
        sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100', bar: 'bg-sky-500', lightBg: 'bg-sky-50/50', check: 'bg-sky-500 border-sky-500' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', bar: 'bg-pink-500', lightBg: 'bg-pink-50/50', check: 'bg-pink-500 border-pink-500' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', bar: 'bg-blue-500', lightBg: 'bg-blue-50/50', check: 'bg-blue-500 border-blue-500' },
    };

    return (
        <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <GraduationCap size={20} className="text-blue-600" />
                    Semester 5 Tracker
                </h3>
            </div>

            {/* Main Progress Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
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

            {academicData.map(subject => {
                const { earned, total } = calculateSubjectProgress(subject);
                const styles = colorStyles[subject.color] || colorStyles.blue;

                return (
                    <div key={subject.id} className={`bg-white rounded-2xl border ${styles.border} shadow-sm overflow-hidden`}>
                        <div className={`${styles.lightBg} px-4 py-3 border-b ${styles.border} flex justify-between items-center`}>
                            <h4 className={`font-bold ${styles.text}`}>{subject.name}</h4>
                            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                {earned}% / {total}%
                            </span>
                        </div>

                        <div className="p-2">
                            {subject.assessments.map(assess => {
                                const isDone = completed[`${subject.id}-${assess.id}`];
                                const isLeading = assess.isLeading;

                                return (
                                    <div
                                        key={assess.id}
                                        onClick={() => toggleAssessment(subject.id, assess.id)}
                                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all select-none relative overflow-hidden
                                            ${isDone ? 'bg-slate-50 opacity-75' : 'hover:bg-slate-50'}
                                            ${isLeading ? 'border border-red-100 bg-red-50/30' : ''}`}
                                    >
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${isDone ? styles.check + ' text-white' : 'border-slate-200 bg-white'}`}>
                                            {isDone && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start pr-8">
                                                <span className={`text-sm font-medium transition-colors ${isDone ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'} ${isLeading ? 'text-red-800' : ''}`}>
                                                    {assess.name}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 ml-2 whitespace-nowrap">{assess.weight}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Progress Bar inside card */}
                        <div className="h-1.5 bg-slate-100 w-full">
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
