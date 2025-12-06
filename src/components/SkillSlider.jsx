import React from 'react';
import { Minus, Plus } from 'lucide-react';

const SkillSlider = ({ label, value, onChange, disabled }) => (
    <div className="mb-5 last:mb-0">
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
            <span className={disabled ? 'opacity-70' : ''}>{label}</span>
            <span className={disabled ? 'opacity-70' : ''}>{value}%</span>
        </div>
        <div className={`flex items-center gap-3 ${disabled ? 'opacity-80' : ''}`}>
            <button
                onClick={() => !disabled && onChange(Math.max(0, value - 1))}
                disabled={disabled}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-bold hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
            >
                <Minus size={14} />
            </button>
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-indigo-500 transition-all duration-300 ease-out" style={{ width: `${value}%` }} />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => !disabled && onChange(e.target.value)}
                    disabled={disabled}
                    className={`absolute top-0 left-0 w-full h-full opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />
            </div>
            <button
                onClick={() => !disabled && onChange(Math.min(100, value + 1))}
                disabled={disabled}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-600 font-bold hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
            >
                <Plus size={14} />
            </button>
        </div>
    </div>
);

export default SkillSlider;
