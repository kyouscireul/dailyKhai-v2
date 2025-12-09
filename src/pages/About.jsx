import React from 'react';
import { Github, Heart, MessageCircle, ExternalLink, Code2, Coffee, Star } from 'lucide-react';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen font-sans pb-24 bg-slate-50 select-none">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10" style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}>
                <div className="max-w-md mx-auto px-4 pt-2 pb-3">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">About Project</h1>
                        <p className="text-slate-500 text-sm font-medium">Transparency & Context</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-6 space-y-6">

                {/* Intro Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                    <Heart className="mb-3 text-white/90" size={28} />
                    <h2 className="text-lg font-bold mb-2">Thank you for testing!</h2>
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                        This application is a labor of love. It is only possible because I've decided to open source the entire codebase on GitHub, making it accessible for everyone to learn from and use.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg w-fit backdrop-blur-sm">
                        <Github size={14} /> Open Source Project
                    </div>
                </div>

                {/* Connect Section */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider ml-1">Connect & Feedback</h3>

                    <a href="https://www.threads.net/@krlmrkrnm" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all active:scale-[0.98]">
                        <div className="bg-black text-white p-2.5 rounded-full">
                            <span className="font-bold text-lg">@</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Follow on Threads</h4>
                            <p className="text-slate-500 text-xs font-medium">@krlmrkrnm</p>
                        </div>
                        <ExternalLink size={16} className="text-slate-400" />
                    </a>

                    <a href="https://forms.gle/eMhLEy9rBq368W3Z7" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all active:scale-[0.98]">
                        <div className="bg-blue-100 text-blue-600 p-2.5 rounded-full">
                            <MessageCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">Leave a Review</h4>
                            <p className="text-slate-500 text-xs font-medium">Google Form Survey</p>
                        </div>
                        <ExternalLink size={16} className="text-slate-400" />
                    </a>
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Coffee className="text-amber-500" size={20} />
                        <h3 className="font-bold text-slate-800">Support the Dev</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                        The app is 100% free. However, if you find it useful, please consider leaving a tip. Even as small as <span className="font-black text-amber-600">RM 1</span> helps me keep going!
                    </p>
                    <button className="w-full bg-amber-100 text-amber-700 font-bold py-3 rounded-xl hover:bg-amber-200 transition-colors flex items-center justify-center gap-2">
                        Donate / Tip
                    </button>
                    {/* Placeholder for actual payment link if provided later */}
                </div>

                {/* Hire Me Section */}
                <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Code2 size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-block bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-3">
                            OPEN FOR WORK
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Build Your Web App</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            I am a student developer looking for funds to support my education. If you need a web application built with modern tech (React, Vite, etc.), hire me!
                        </p>
                        <div className="flex gap-2">
                            <a href="https://www.threads.net/@krlmrkrnm" target="_blank" rel="noopener noreferrer"
                                className="flex-1 bg-white text-slate-900 font-bold py-2.5 rounded-lg text-center text-sm hover:bg-slate-100 transition-colors">
                                Contact Me
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-4 pb-2 opacity-50">
                    <p className="text-[10px] font-bold text-slate-400">Version 3.0.0 • Open Source</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
