export const mockCollaborationTasks = [
  {
    id: "tsk-001",
    title: "Verify Audiovisual & 4K Projector in Main Auditorium",
    assignedTo: "Prof. Ananya Sharma",
    assignedRole: "Event Lead",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    priority: "High",
    status: "Completed",
    dueDate: "2026-09-14",
    department: "CSE & Tech Guild"
  },
  {
    id: "tsk-002",
    title: "Review Google Cloud & Microsoft Azure Sponsor Deliverables",
    assignedTo: "Dr. Rajesh K. Verma",
    assignedRole: "Dean / Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-09-12",
    department: "Administration"
  },
  {
    id: "tsk-003",
    title: "Print 300x QR Badges & Prepare Volunteer Welcome Kits",
    assignedTo: "Debjit Banerjee",
    assignedRole: "Student Coordinator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-09-13",
    department: "Student Affairs"
  },
  {
    id: "tsk-004",
    title: "Confirm Catering Menu for 250 Delegates & Midnight Pizza",
    assignedTo: "Priya Sundaram",
    assignedRole: "Hospitality Lead",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-09-10",
    department: "Logistics Team"
  },
  {
    id: "tsk-005",
    title: "Setup Wi-Fi 6 Dedicated SSID (CampusConnect_Hack5G)",
    assignedTo: "Arjun Nambiar",
    assignedRole: "DevOps & Network Lead",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    priority: "High",
    status: "Pending",
    dueDate: "2026-09-14",
    department: "IT Infrastructure"
  }
];

export const mockEventDiscussions = [
  {
    id: "dsc-001",
    eventId: "evt-001",
    authorName: "Rohan Mukherjee",
    authorRole: "Student / Hacker",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    timestamp: "2 hours ago",
    question: "Will hardware testkits and IoT Arduino boards be provided at Computing Lab 4, or should teams bring their own sensors?",
    upvotes: 14,
    isPinned: false,
    replies: [
      {
        id: "rep-001",
        authorName: "Prof. Ananya Sharma",
        authorRole: "Lead Organizer",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        timestamp: "1 hour ago",
        text: "Yes, Rohan! We have 40x ESP32 and Arduino starter kits available at the Hardware Helpdesk. You can check them out with your digital ticket pass.",
        isOfficial: true
      }
    ]
  },
  {
    id: "dsc-002",
    eventId: "evt-001",
    authorName: "Sneha Patel",
    authorRole: "Student",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    timestamp: "5 hours ago",
    question: "Is there any specific guideline regarding the team formation? Can students from different branches form a cross-department team?",
    upvotes: 22,
    isPinned: true,
    replies: [
      {
        id: "rep-002",
        authorName: "Debjit Banerjee",
        authorRole: "Lead Coordinator",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        timestamp: "3 hours ago",
        text: "Absolutely! Interdisciplinary teams (e.g. CSE + Biotech + Management) are strongly encouraged and get bonus innovation points during jury rounds.",
        isOfficial: true
      }
    ]
  }
];

export const mockLiveAnnouncements = [
  {
    id: "ann-001",
    eventId: "evt-001",
    title: "Room Update: Mentorship Round 1 moved to Seminar Hall 1",
    timestamp: "10 mins ago",
    type: "Urgent",
    message: "Mentors from Google Cloud and Microsoft will now conduct code architecture reviews in Seminar Hall 1 from 7:00 PM onwards."
  },
  {
    id: "ann-002",
    eventId: "evt-001",
    title: "High-Speed Wi-Fi Credentials Active",
    timestamp: "1 hour ago",
    type: "Info",
    message: "Connect to SSID 'InnovateX_5G' using the passkey generated on your Digital Ticket Pass."
  }
];
