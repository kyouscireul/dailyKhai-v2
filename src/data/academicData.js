export const academicData = [
    {
        id: "csp600",
        name: "CSP 600",
        color: "indigo",
        assessments: [
            { id: "proj_motivation", name: "Project Motivation", weight: 10 },
            { id: "lit_review", name: "Literature Review", weight: 10 },
            { id: "methodology", name: "Methodology", weight: 10 },
            { id: "presentation", name: "Presentation", weight: 25 },
            { id: "written_report", name: "Written Report", weight: 45 },
        ]
    },
    {
        id: "mobile_tech",
        name: "Mobile Tech",
        color: "emerald",
        assessments: [
            { id: "test1", name: "Test 1 (After Midsem)", weight: 10 },
            { id: "group_proj", name: "Group Project (App due W13)", weight: 30, isLeading: true },
            { id: "lab", name: "Continued Lab", weight: 20 },
            { id: "final_exam", name: "Final Exam", weight: 40 },
        ]
    },
    {
        id: "network_design",
        name: "Network Design",
        color: "violet",
        assessments: [
            { id: "case_study", name: "Case Study (Due W7)", weight: 20 },
            { id: "design_demo", name: "Design Demonstration", weight: 10 },
            { id: "group_proj_net", name: "Group Project", weight: 40, isLeading: true },
            { id: "final_test_net", name: "Final Test", weight: 30 },
        ]
    },
    {
        id: "digital_forensic",
        name: "Digital Forensic",
        color: "rose",
        assessments: [
            { id: "test1_df", name: "Test 1 (Week 9)", weight: 20 },
            { id: "group_proj_df", name: "Group Project", weight: 20 },
            { id: "lab_assess", name: "Offline Lab Assessment (W10)", weight: 20 },
            { id: "cont_lab_df", name: "Continued Lab", weight: 10 },
            { id: "test2_df", name: "Test 2 (Week 14)", weight: 30 },
        ]
    },
    {
        id: "backend",
        name: "Backend",
        color: "amber",
        assessments: [
            { id: "case_study_be", name: "Case Study Report (Due W9)", weight: 30 },
            { id: "group_proj_be", name: "Group Project (Due W13)", weight: 30 },
            { id: "indiv_proj_be", name: "Individual Project (W10)", weight: 20 },
            { id: "indiv_proj_2_be", name: "Individual Project 2", weight: 20 },
        ]
    },
    {
        id: "lcc",
        name: "LCC",
        color: "sky",
        assessments: [
            { id: "discussion", name: "Discussion", weight: 40 },
            { id: "email", name: "Email (Week 6)", weight: 10 },
            { id: "formal_meeting", name: "Formal Meeting", weight: 40 },
            { id: "meeting_minutes", name: "Meeting Minutes", weight: 10 },
        ]
    },
    {
        id: "japanese",
        name: "Japanese",
        color: "pink",
        assessments: [
            { id: "listening", name: "Listening Test (Week 9)", weight: 30 },
            { id: "writing", name: "Writing Test", weight: 30 },
            { id: "verbal", name: "Verbal Test", weight: 40 },
        ]
    }
];
