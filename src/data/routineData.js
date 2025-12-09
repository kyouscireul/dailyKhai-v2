export const defaultRoutines = {
    1: {
        morning: [
            { id: "m1", text: "Wake 6 AM & Subuh", completed: false, type: "core" },
            { id: "m2", text: "Morning Focus", completed: false, subtext: "Run/Workout/Work/Chores", type: "flex" },
            { id: "m3", text: "Bath & Brunch", completed: false, type: "restore" }
        ],
        afternoon: [
            { id: "a1", text: "Zohor Prayer", completed: false, subtext: "Don't delay", type: "prayer" },
            { id: "a2", text: "Talk with a friend", completed: false, subtext: "How are you feeling?", type: "heart-sm" },
            { id: "a3", text: "Flexible Time", completed: false, subtext: "Anime, Games, Light Work", type: "chill" }
        ],
        evening: [
            { id: "e1", text: "Asar Prayer", completed: false, subtext: "Don't delay", type: "prayer" },
            { id: "e2", text: "Finish up work", completed: false, type: "work" },
            { id: "e3", text: "Early Dinner", completed: false, type: "restore" },
            { id: "e4", text: "Organize / Tidy up", completed: false, type: "core" }
        ],
        night: [
            { id: "n1", text: "Maghrib Prayer", completed: false, type: "prayer" },
            { id: "n2", text: "Leisure / Assignments", completed: false, subtext: "With friends", type: "social" },
            { id: "n3", text: "Isyak Prayer", completed: false, type: "prayer" },
            { id: "n4", text: "Meeting", completed: false, type: "work" },
            { id: "n5", text: "Sleep and Personal Time", completed: false, type: "social" }
        ]
    },
    2: {
        morning: [
            { id: "l2_m1", text: "Wake before Subuh", completed: false, type: "core", highlight: true },
            { id: "l2_m2", text: "Subuh Prayer", completed: false, type: "prayer" },
            { id: "l2_m3", text: "Run / Workout", completed: false, subtext: "Get outside immediately", type: "fitness" },
            { id: "l2_m4", text: "Bath & Brunch", completed: false, type: "restore" }
        ],
        work_block: [
            { id: "l2_w1", text: "Degree Work", completed: false, subtext: "Focus session", type: "work" },
            { id: "l2_w2", text: "Side Project (Dev)", completed: false, type: "code" }
        ],
        afternoon: [
            { id: "l2_a1", text: "Zohor @ Mosque", completed: false, subtext: "Go out", type: "mosque" },
            { id: "l2_a2", text: "Talk with a friend", completed: false, type: "heart-sm" },
            { id: "l2_a3", text: "Chores", completed: false, type: "home" },
            { id: "l2_a4", text: "Afternoon Work", completed: false, type: "work" }
        ],
        evening: [
            { id: "l2_e1", text: "Asar @ Mosque", completed: false, type: "mosque" },
            { id: "l2_e2", text: "Prepare Dinner", completed: false, subtext: "Cook healthy", type: "food" },
            { id: "l2_e3", text: "Work Wrap-up", completed: false, type: "work" }
        ],
        night: [
            { id: "l2_n1", text: "Maghrib Prayer", completed: false, type: "prayer" },
            { id: "l2_n2", text: "Recite Quran", completed: false, type: "spirit" },
            { id: "l2_n3", text: "Active Leisure", completed: false, subtext: "Film / Series", type: "film" },
            { id: "l2_n4", text: "Call Parents", completed: false, type: "social-call" },
            { id: "l2_n5", text: "Isyak Prayer", completed: false, type: "prayer" },
            { id: "l2_n6", text: "Sleep and Personal Time", completed: false, type: "social" }
        ]
    },
    3: {
        morning: [
            { id: "l3_m1", text: "Wake before Subuh", completed: false, type: "core", highlight: true },
            { id: "l3_m2", text: "Subuh @ MOSQUE", completed: false, type: "mosque" },
            { id: "l3_m3", text: "Hard Workout", completed: false, subtext: "NON-NEGOTIABLE", type: "fitness-hard" },
            { id: "l3_m4", text: "Bath & Brunch", completed: false, type: "restore" }
        ],
        work_block: [
            { id: "l3_w1", text: "Degree Work", completed: false, subtext: "Deep focus", type: "work" },
            { id: "l3_w2", text: "Side Project", completed: false, subtext: "Build & Ship", type: "code" }
        ],
        afternoon: [
            { id: "l3_a1", text: "Zohor @ MOSQUE", completed: false, type: "mosque" },
            { id: "l3_a2", text: "Talk with a friend", completed: false, type: "heart-sm" },
            { id: "l3_a3", text: "Chores", completed: false, type: "home" },
            { id: "l3_a4", text: "Afternoon Work", completed: false, type: "work" }
        ],
        evening: [
            { id: "l3_e1", text: "Asar @ MOSQUE", completed: false, type: "mosque" },
            { id: "l3_e2", text: "Prepare Dinner", completed: false, type: "food" },
            { id: "l3_e3", text: "Work Wrap-up", completed: false, type: "work" }
        ],
        night: [
            { id: "l3_n1", text: "Maghrib @ MOSQUE", completed: false, type: "mosque" },
            { id: "l3_n2", text: "Recite Quran", completed: false, type: "spirit" },
            { id: "l3_n3", text: "EXTRA WORK", completed: false, subtext: "No games. Pure progress.", type: "grind" },
            { id: "l3_n4", text: "Isyak @ MOSQUE", completed: false, type: "mosque" },
            { id: "l3_n5", text: "Sleep and Personal Time", completed: false, type: "social" }
        ]
    }
};
