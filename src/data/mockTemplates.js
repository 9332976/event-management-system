export const mockEventTemplates = [
  {
    id: "tpl-conference",
    name: "Academic / Industry Tech Conference",
    type: "Conference",
    category: "technical",
    categoryLabel: "Technical",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    description: "Multi-track keynote conference with paper presentations, panel debates, and networking roundtables.",
    defaultDuration: "2 Days",
    defaultVenue: "Main University Auditorium & Seminar Hall 2",
    suggestedCapacity: 500,
    price: "₹499 (Standard) / ₹999 (VIP All-Access)",
    prizes: "Best Research Paper Award (₹25,000) + Publication in IEEE Index",
    banner: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "Submissions must adhere to IEEE 2-column format.",
      "Author must present live in session to receive indexing certificate.",
      "Conference pass includes keynote delegate lunch and seminar kit."
    ],
    defaultAgenda: [
      { time: "09:00 AM", title: "Registration & Welcome Coffee", desc: "Badge pickup at Main Foyer." },
      { time: "10:00 AM", title: "Inaugural Keynote by Industry Chief", desc: "Main Auditorium." },
      { time: "11:30 AM", title: "Track A: AI & Deep Learning", desc: "Seminar Hall 1." },
      { time: "01:00 PM", title: "Executive Delegate Lunch", desc: "Banquet Lawn." },
      { time: "02:30 PM", title: "Track B: Cloud Systems & Quantum Computing", desc: "Computing Lab 4." },
      { time: "05:00 PM", title: "Panel Discussion & Valedictory Awards", desc: "Main Auditorium." }
    ]
  },
  {
    id: "tpl-hackathon",
    name: "36-Hour National Sprint Hackathon",
    type: "Hackathon",
    category: "hackathon",
    categoryLabel: "Hackathon",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    description: "Intense overnight software & hardware prototyping sprint with industry mentors, API sponsors, and jury evaluation.",
    defaultDuration: "36 Hours",
    defaultVenue: "Turing Computing Lab 4 & 5",
    suggestedCapacity: 250,
    price: "Free Registration",
    prizes: "₹1,50,000 Cash Pool + Internship Fast-Tracks",
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "All code must be committed to GitHub during the hackathon timeline.",
      "Teams of 2 to 4 members allowed.",
      "Pre-existing proprietary code is prohibited.",
      "24/7 Red Bull & midnight pizza provided for all hackers."
    ],
    defaultAgenda: [
      { time: "09:00 AM", title: "Check-in & Hacker Kit Distribution", desc: "Lab 4 Entrance." },
      { time: "10:30 AM", title: "Problem Statements & Sponsor APIs Unveiling", desc: "Main Auditorium." },
      { time: "11:30 AM", title: "Hacking Begins (Timer Starts)", desc: "Lab 4 & 5." },
      { time: "07:00 PM", title: "Mentorship Round 1: Architecture Check", desc: "Mentor pods." },
      { time: "12:00 AM", title: "Midnight Pizza & VR Gaming Break", desc: "Lounge area." },
      { time: "04:00 PM (Day 2)", title: "Final Code Freeze & Demo Submissions", desc: "Portal submission." },
      { time: "07:00 PM (Day 2)", title: "Top 10 Final Stage Pitches & Awards", desc: "Main Stage." }
    ]
  },
  {
    id: "tpl-concert",
    name: "Live Music Concert & Cultural Fest Night",
    type: "Concert",
    category: "cultural",
    categoryLabel: "Cultural",
    badgeColor: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    description: "High-voltage live band performances, celebrity headliners, acoustic sets, and laser lighting show.",
    defaultDuration: "1 Evening (4:00 PM - 11:00 PM)",
    defaultVenue: "Open-Air Amphitheatre & Central Lawns",
    suggestedCapacity: 1500,
    price: "₹299 (General) / ₹799 (VIP Fan Pit)",
    prizes: "Inter-College Battle of Bands Trophy + ₹50,000",
    banner: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "College ID or Digital Pass required for security gate entry.",
      "No outside beverages permitted inside the arena.",
      "Wristband verification required for VIP Fan Pit."
    ],
    defaultAgenda: [
      { time: "04:00 PM", title: "Gates Open & Food Trucks Live", desc: "Amphitheatre Entrance." },
      { time: "05:00 PM", title: "Opening Act: College Rock Society", desc: "Main Stage." },
      { time: "06:30 PM", title: "Battle of the Bands Semi-Finals", desc: "Acoustic Shell." },
      { time: "08:30 PM", title: "Celebrity Headliner Live Performance", desc: "Main Stage with Laser Effects." },
      { time: "10:30 PM", title: "Grand Finale Fireworks & Awards", desc: "Central Plaza." }
    ]
  },
  {
    id: "tpl-corporate",
    name: "Corporate Gathering & Alumni Leadership Gala",
    type: "Corporate Gathering",
    category: "seminar",
    categoryLabel: "Corporate / Seminar",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    description: "Executive leadership networking, corporate sponsorship announcements, awards banquet, and panel roundtables.",
    defaultDuration: "1 Day",
    defaultVenue: "Grand Executive Banquet Hall",
    suggestedCapacity: 300,
    price: "Invitation / Corporate Pass (₹1,500)",
    prizes: "Distinguished Alumni of the Year Medallion",
    banner: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "Business formal attire requested.",
      "Registration includes executive cocktails & 5-course dinner.",
      "Digital pass syncs with name badge printer on arrival."
    ],
    defaultAgenda: [
      { time: "05:00 PM", title: "Executive Welcome Cocktails & Networking", desc: "Banquet Foyer." },
      { time: "06:00 PM", title: "State of the University Address by Dean", desc: "Main Ballroom." },
      { time: "07:00 PM", title: "Panel: Future of Industry 5.0 & Tech Leadership", desc: "Stage Podium." },
      { time: "08:30 PM", title: "Distinguished Alumni Honors & Awards", desc: "Main Ballroom." },
      { time: "09:15 PM", title: "Gala Dinner Banquet & Live Jazz Music", desc: "Dining Pavilion." }
    ]
  },
  {
    id: "tpl-workshop",
    name: "Hands-On Masterclass & Certification Workshop",
    type: "Workshop",
    category: "workshop",
    categoryLabel: "Workshop",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    description: "Intensive 1-day skill-building boot camp with hands-on lab exercises and verifiable industry certificate.",
    defaultDuration: "6 Hours",
    defaultVenue: "Dr. APJ Abdul Kalam Seminar Hall",
    suggestedCapacity: 120,
    price: "₹199 (Includes Cloud Sandbox & Certificate)",
    prizes: "Top Performer Course Grant + Certified Badge",
    banner: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "Bring your own laptop with Wi-Fi capability.",
      "Prerequisites repository must be cloned before session start.",
      "Attendance in both morning and afternoon lab required for certificate."
    ],
    defaultAgenda: [
      { time: "09:30 AM", title: "Setup & Cloud Sandbox Provisioning", desc: "Seminar Hall." },
      { time: "10:00 AM", title: "Module 1: Fundamental Concepts & Architecture", desc: "Interactive Lecture." },
      { time: "12:00 PM", title: "Module 2: Live Code-along Implementation", desc: "Hands-on Lab." },
      { time: "01:30 PM", title: "Lunch & Networking Break", desc: "Cafeteria." },
      { time: "02:30 PM", title: "Module 3: Capstone Mini-Project & Deployment", desc: "Hands-on Lab." },
      { time: "04:30 PM", title: "Q&A, Evaluation & Certificate Issuance", desc: "Stage Podium." }
    ]
  },
  {
    id: "tpl-wedding",
    name: "Campus Wedding & Reception Celebration",
    type: "Wedding / Reception",
    category: "cultural",
    categoryLabel: "Social / Wedding",
    badgeColor: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    description: "Grand banquet reception with curated floral decor, multi-course dining, stage setup, and guest hospitality.",
    defaultDuration: "1 Full Day",
    defaultVenue: "Grand Executive Banquet Hall & Gardens",
    suggestedCapacity: 400,
    price: "Private Booking / Guest Pass",
    prizes: "Wedding Keepsake Gift Box for Delegates",
    banner: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80",
    suggestedRules: [
      "Valet parking available at Guest House gate.",
      "RSVP confirmation required for banquet catering headcount.",
      "Photography and videography crew on-site."
    ],
    defaultAgenda: [
      { time: "11:00 AM", title: "Guest Arrival & Welcome Drinks", desc: "Banquet Garden Lawn." },
      { time: "12:30 PM", title: "Ceremony & Stage Blessings", desc: "Main Stage Mandap." },
      { time: "02:00 PM", title: "Grand Wedding Luncheon Feast", desc: "Banquet Hall." },
      { time: "06:30 PM", title: "Evening Sangeet & Musical Reception", desc: "Ballroom & Dance Floor." },
      { time: "09:00 PM", title: "Dinner & Farewell Toast", desc: "Dining Pavilion." }
    ]
  }
];
