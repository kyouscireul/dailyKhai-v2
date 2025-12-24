import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Flame, Dumbbell, BookOpen, DollarSign, Moon, Heart } from 'lucide-react';
import FocusQueue from '../components/pillars/FocusQueue';
import AcademicTracker from '../components/pillars/AcademicTracker';
import FinanceTracker from '../components/pillars/FinanceTracker';
import { supabase } from '../lib/supabaseClient';

const iconMap = {
    Target, Eye, Flame, Dumbbell, BookOpen, DollarSign, Moon, Heart
};

const PillarDetail = () => {
    const { type } = useParams();
    const [pillar, setPillar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPillar = async () => {
            try {
                const { data, error } = await supabase
                    .from('pillars')
                    .select('*')
                    .eq('type', type)
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;
                setPillar(data);
            } catch (error) {
                console.error('Error fetching pillar:', error);
                setPillar(null);
            } finally {
                setLoading(false);
            }
        };

        if (type) {
            fetchPillar();
        }
    }, [type]);


    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading pillar data...</div>;
    }

    if (!pillar) {
        return <div className="p-10 text-center text-slate-500">Pillar not found</div>;
    }

    const Icon = iconMap[pillar.icon] || Target;

    // Helper to see if widget matches (currently checking type for Focus)
    // In future, we can add a 'widget_type' column to the DB
    const isFocus = pillar.type === 'focus';
    const isAcademic = pillar.type === 'academic';
    const isFinancial = pillar.type === 'financial';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans p-4 transition-colors duration-300">
            <div className="max-w-md mx-auto">
                <Link to="/goals" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <ArrowLeft size={18} /> Back to Goals
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${pillar.color}`}>
                        <Icon size={24} />
                    </div>

                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight transition-colors">{pillar.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">{pillar.description}</p>

                    {/* Render Widgets based on type */}
                    {isFocus && <FocusQueue />}
                    {isAcademic && <AcademicTracker />}
                    {isFinancial && <FinanceTracker />}

                    <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8 text-center transition-colors">
                        <div className="inline-block bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 transition-colors">
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <p className="text-slate-300 dark:text-slate-500 font-medium italic">Metrics coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PillarDetail;
