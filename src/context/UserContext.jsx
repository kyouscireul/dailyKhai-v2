import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchUserData = async () => {
            try {
                // 1. Get Auth User
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (mounted) setUser(authUser);

                if (authUser) {
                    // 2. Parallel Fetch: Profile & Progress
                    const [profileResult, progressResult] = await Promise.all([
                        supabase.from('profiles').select('*').eq('id', authUser.id).single(),
                        supabase.from('user_progress').select('*').eq('id', authUser.id).single()
                    ]);

                    if (mounted) {
                        if (profileResult.data) setProfile(profileResult.data);
                        if (progressResult.data) setProgress(progressResult.data);
                    }
                }
            } catch (error) {
                console.error("Error in UserContext:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchUserData();

        // Listen for Auth Changes (Sign In / Sign Out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setProgress({});
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    setUser(session.user);
                    // Optionally re-fetch profile/progress here if needed
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Helper to update local progress state when components save data
    const updateProgress = (newProgress) => {
        setProgress(prev => ({ ...prev, ...newProgress }));
    };

    const value = {
        user,
        profile,
        progress,
        loading,
        updateProgress
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
