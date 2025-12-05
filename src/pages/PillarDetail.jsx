import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Flame, Dumbbell, BookOpen, DollarSign, Moon, Heart } from 'lucide-react';
import { pillarData } from '../data/pillarData';
import FocusQueue from '../components/pillars/FocusQueue';
import AcademicTracker from '../components/pillars/AcademicTracker';

const iconMap = {
    Target, Eye, Flame, Dumbbell, BookOpen, DollarSign, Moon, Heart
};

const PillarDetail = () => {
    const { type } = useParams();
    const pillar = pillarData[type];

    if (!pillar) {
        return <div className="p-10 text-center">Pillar not found</div>;
    }

    const Icon = iconMap[pillar.icon] || Target;

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-4">
            <Link to="/goals" className="inline-flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-600 transition-colors">
                <ArrowLeft size={18} /> Back to Goals
            </Link>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${pillar.color}`}>
                    <Icon size={24} />
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">{pillar.title}</h1>
                <p className="text-slate-500 font-medium leading-relaxed">{pillar.description}</p>

                {pillar.widget === 'focusQueue' && <FocusQueue />}
                {pillar.widget === 'academicTracker' && <AcademicTracker />}

                <div className="mt-8 border-t border-slate-100 pt-8 text-center">
                    <div className="inline-block bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                        <p className="text-slate-300 font-medium italic">Metrics coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PillarDetail;
