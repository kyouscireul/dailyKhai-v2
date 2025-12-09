export const defaultRoutines = {
    1: { // Work / Business Context
        morning: [
            { id: "w_m1", text: "Check Key Metrics", completed: false, subtext: "Sales, Leads, Cashflow", type: "work" },
            { id: "w_m2", text: "Review Calendar", completed: false, subtext: "Identify priorities", type: "core" },
            { id: "w_m3", text: "Email Triage", completed: false, subtext: "Inbox Zero strategy", type: "work" },
            { id: "w_m4", text: "Team Standup", completed: false, type: "social" }
        ],
        afternoon: [
            { id: "w_a1", text: "Deep Work Block", completed: false, subtext: "Strategic Projects", type: "focus" },
            { id: "w_a2", text: "Client Calls", completed: false, subtext: "Sales or Support", type: "social-call" },
            { id: "w_a3", text: "Admin & Ops", completed: false, subtext: "Invoices, delegating", type: "admin" }
        ],
        evening: [
            { id: "w_e1", text: "Review Day's Progress", completed: false, type: "core" },
            { id: "w_e2", text: "Plan Tomorrow", completed: false, subtext: "Select top 3 tasks", type: "core" },
            { id: "w_e3", text: "Clear Workspace", completed: false, type: "home" }
        ],
        night: [
            { id: "w_n1", text: "Skill Development", completed: false, subtext: "Read or Course", type: "grow" },
            { id: "w_n2", text: "Networking", completed: false, subtext: "LinkedIn or Events", type: "social" },
            { id: "w_n3", text: "Shutdown Ritual", completed: false, subtext: "Disconnect fully", type: "restore" }
        ]
    },
    2: { // Life / Daily Context
        morning: [
            { id: "l_m1", text: "Wake Up Early", completed: false, subtext: "Before sunrise", type: "core" },
            { id: "l_m2", text: "Morning Prayers / Meditation", completed: false, type: "spirit" },
            { id: "l_m3", text: "Family Breakfast", completed: false, type: "social" },
            { id: "l_m4", text: "House Chores", completed: false, subtext: "Tidy up", type: "home" }
        ],
        afternoon: [
            { id: "l_a1", text: "Midday Prayers / Reflection", completed: false, type: "spirit" },
            { id: "l_a2", text: "Grocery / Errands", completed: false, type: "home" },
            { id: "l_a3", text: "Connect with Friends", completed: false, type: "social-call" }
        ],
        evening: [
            { id: "l_e1", text: "Evening Prayers", completed: false, type: "spirit" },
            { id: "l_e2", text: "Cook Dinner", completed: false, type: "food" },
            { id: "l_e3", text: "Family Time", completed: false, subtext: "No phones", type: "heart-sm" }
        ],
        night: [
            { id: "l_n1", text: "Night Prayers", completed: false, type: "spirit" },
            { id: "l_n2", text: "Journaling", completed: false, subtext: "Gratitude log", type: "core" },
            { id: "l_n3", text: "Read Fiction / Relax", completed: false, type: "chill" },
            { id: "l_n4", text: "Sleep", completed: false, subtext: "7-8 hours", type: "restore" }
        ]
    },
    3: { // Health / Wellness Context
        morning: [
            { id: "h_m1", text: "Hydrate", completed: false, subtext: "500ml Water", type: "health" },
            { id: "h_m2", text: "Stretching / Yoga", completed: false, type: "fitness" },
            { id: "h_m3", text: "Cardio Session", completed: false, subtext: "Running or Walk", type: "fitness-hard" },
            { id: "h_m4", text: "Healthy Breakfast", completed: false, subtext: "High Protein", type: "food" }
        ],
        afternoon: [
            { id: "h_a1", text: "Mental Health Break", completed: false, subtext: "Breathing exercises", type: "mind" },
            { id: "h_a2", text: "Healthy Lunch", completed: false, subtext: "Greens & Fiber", type: "food" },
            { id: "h_a3", text: "Movement Snack", completed: false, subtext: "Walk or Stretch", type: "fitness" }
        ],
        evening: [
            { id: "h_e1", text: "Strength Training", completed: false, subtext: "Weights or Calisthenics", type: "fitness-hard" },
            { id: "h_e2", text: "Post-workout Meal", completed: false, type: "food" },
            { id: "h_e3", text: "Digital Detox", completed: false, subtext: "Reduce blue light", type: "health" }
        ],
        night: [
            { id: "h_n1", text: "Magnesium / Supplements", completed: false, type: "health" },
            { id: "h_n2", text: "Skincare Routine", completed: false, type: "restore" },
            { id: "h_n3", text: "Meditation / Sleep Prep", completed: false, type: "mind" }
        ]
    }
};
