export const mockSponsorshipTiers = [
  {
    tier: "Title Sponsor",
    amount: "₹5,00,000",
    color: "from-amber-400 via-amber-500 to-yellow-600",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    benefits: [
      "Event Naming Rights (e.g. 'Powered by YourBrand')",
      "15-Minute Keynote Address at Inauguration",
      "Prime 20x20ft Premium Exhibition Island Booth",
      "Logo on all Digital Passports, Certificates & Banners",
      "Direct Access to Participant Resumes & Candidate Pool",
      "20 VIP Delegate All-Access Passes"
    ],
    currentSponsors: [
      {
        name: "Google Cloud & Developer Ecosystem",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
        website: "https://cloud.google.com",
        contactPerson: "Rajiv Malhotra (Head of Campus DevRel)",
        status: "Confirmed & Signed",
        allocatedBooth: "Booth Island A1"
      }
    ]
  },
  {
    tier: "Platinum Partner",
    amount: "₹2,50,000",
    color: "from-slate-400 via-slate-500 to-indigo-500",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
    benefits: [
      "10-Minute Tech Spotlight / Workshop Track",
      "12x12ft Prominent Stall in Main Foyer",
      "Logo on Web Portal, LED Backdrop & Stage Screens",
      "Exclusive Hackathon Problem Statement & Prize Category",
      "10 VIP Delegate Passes"
    ],
    currentSponsors: [
      {
        name: "Microsoft Azure for Students",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        website: "https://azure.microsoft.com",
        contactPerson: "Kavita Rao (Academic Relations Lead)",
        status: "Confirmed & Signed",
        allocatedBooth: "Booth B1"
      },
      {
        name: "Red Bull Energy Station",
        logo: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=80",
        website: "https://redbull.com",
        contactPerson: "Sameer Joshi (Campus Ambassador Mgr)",
        status: "Active Sponsor",
        allocatedBooth: "Lounge B4"
      }
    ]
  },
  {
    tier: "Gold Sponsor",
    amount: "₹1,00,000",
    color: "from-amber-500 to-orange-500",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    benefits: [
      "Standard 8x8ft Exhibition Stall Canopy",
      "Logo on Event Landing Page & Print Handouts",
      "5 Delegate Passes & Goodie Bag Inclusions",
      "Mention during Grand Awards Ceremony"
    ],
    currentSponsors: [
      {
        name: "GitHub Education",
        logo: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=150&auto=format&fit=crop&q=80",
        website: "https://education.github.com",
        contactPerson: "Arun Verma",
        status: "Confirmed",
        allocatedBooth: "Booth C2"
      }
    ]
  },
  {
    tier: "Silver Sponsor & Community Partner",
    amount: "₹50,000",
    color: "from-slate-300 to-slate-400",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    benefits: [
      "Logo on website partners section",
      "Social media shoutout across 35,000+ student network",
      "2 Attendee Passes"
    ],
    currentSponsors: [
      {
        name: "Postman Student Program",
        logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
        website: "https://postman.com/student-program",
        contactPerson: "Neha Bansal",
        status: "Confirmed",
        allocatedBooth: "Booth D3"
      }
    ]
  }
];

export const mockExhibitorBooths = [
  { id: "A1", label: "Booth A1 (Island 20x20)", company: "Google Cloud", size: "20x20 ft", status: "Occupied", category: "Cloud & AI", powerSupplied: "5 KW", wifi: "Dedicated 100Mbps" },
  { id: "B1", label: "Booth B1 (Premium 12x12)", company: "Microsoft Azure", size: "12x12 ft", status: "Occupied", category: "Developer Tools", powerSupplied: "3 KW", wifi: "High-Speed" },
  { id: "B2", label: "Booth B2 (Premium 12x12)", company: "Available", size: "12x12 ft", status: "Available", category: "Open for Booking", powerSupplied: "3 KW", wifi: "Standard" },
  { id: "B3", label: "Booth B3 (Premium 12x12)", company: "Available", size: "12x12 ft", status: "Available", category: "Open for Booking", powerSupplied: "3 KW", wifi: "Standard" },
  { id: "B4", label: "Booth B4 (Beverage Lounge)", company: "Red Bull Energy Station", size: "15x15 ft", status: "Occupied", category: "F&B / Hospitality", powerSupplied: "4 KW", wifi: "High-Speed" },
  { id: "C1", label: "Booth C1 (Standard 8x8)", company: "Available", size: "8x8 ft", status: "Available", category: "Startup Pod", powerSupplied: "1.5 KW", wifi: "Standard" },
  { id: "C2", label: "Booth C2 (Standard 8x8)", company: "GitHub Education", size: "8x8 ft", status: "Occupied", category: "Dev Community", powerSupplied: "1.5 KW", wifi: "High-Speed" },
  { id: "C3", label: "Booth C3 (Standard 8x8)", company: "Available", size: "8x8 ft", status: "Available", category: "Open for Booking", powerSupplied: "1.5 KW", wifi: "Standard" },
  { id: "D1", label: "Booth D1 (Community 8x8)", company: "Robotics Club Expo", size: "8x8 ft", status: "Occupied", category: "Student Innovation", powerSupplied: "2 KW", wifi: "Standard" },
  { id: "D2", label: "Booth D2 (Community 8x8)", company: "E-Cell Incubation Desk", size: "8x8 ft", status: "Occupied", category: "Student Innovation", powerSupplied: "1 KW", wifi: "Standard" },
  { id: "D3", label: "Booth D3 (Community 8x8)", company: "Postman Student Program", size: "8x8 ft", status: "Occupied", category: "Dev Tools", powerSupplied: "1.5 KW", wifi: "High-Speed" },
  { id: "D4", label: "Booth D4 (Community 8x8)", company: "Available", size: "8x8 ft", status: "Available", category: "Open for Booking", powerSupplied: "1.5 KW", wifi: "Standard" },
];
