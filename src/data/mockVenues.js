export const mockVenues = [
  {
    id: "ven-001",
    name: "Main University Auditorium",
    category: "Auditorium",
    capacity: 650,
    location: "Academic Block A, Ground Floor",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
    amenities: ["4K Laser Projector", "Dolby Atmos Sound", "Central AC", "Green Rooms", "Stage Lighting Rig", "Livestream Rig"],
    status: "Available",
    hourlyRate: "₹4,500/hr",
    floorPlans: [
      { name: "Theater Style", capacity: 650, suitableFor: "Keynotes, Concerts, Inception Ceremonies" },
      { name: "Semi-Circle Forum", capacity: 480, suitableFor: "Panel Discussions, Debates" },
      { name: "Classroom Exam", capacity: 320, suitableFor: "Hackathon Pitches, Contests" }
    ],
    upcomingBookings: [
      { eventId: "evt-001", eventTitle: "InnovateX 2026 Hackathon", date: "2026-09-15", timeSlot: "08:00 AM - 08:00 PM" },
      { eventId: "evt-002", eventTitle: "Tarang Cultural Fest", date: "2026-10-08", timeSlot: "02:00 PM - 10:00 PM" }
    ]
  },
  {
    id: "ven-002",
    name: "Turing Computing Lab 4 & 5",
    category: "Computer Lab",
    capacity: 220,
    location: "CSE Department, 3rd Floor",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    amenities: ["Gigabit LAN & Wi-Fi 6", "220x i7 Workstations", "UPS Power Backup", "Dual HD Displays", "Server Access"],
    status: "Available",
    hourlyRate: "₹2,500/hr",
    floorPlans: [
      { name: "Cluster Pods", capacity: 220, suitableFor: "Hackathons, Team Coding Sprints" },
      { name: "Exam / Contest Rows", capacity: 180, suitableFor: "Competitive Programming, CTFs" }
    ],
    upcomingBookings: [
      { eventId: "evt-001", eventTitle: "InnovateX 2026 Hackathon", date: "2026-09-15", timeSlot: "09:00 AM - 11:59 PM" }
    ]
  },
  {
    id: "ven-003",
    name: "Open-Air Amphitheatre & Lawns",
    category: "Outdoor Arena",
    capacity: 1500,
    location: "Central Campus Plaza",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    amenities: ["Open Air Acoustic Shell", "Heavy Power Genset", "Food Stall Enclosure", "Security Barricades", "Flood Lights"],
    status: "Available",
    hourlyRate: "₹6,000/hr",
    floorPlans: [
      { name: "Concert Standing + Seating", capacity: 1500, suitableFor: "Rock Concerts, Band Nights, EDM" },
      { name: "Exhibition Canopy Stalls", capacity: 900, suitableFor: "Club Fair, Food & Sponsor Expo" }
    ],
    upcomingBookings: [
      { eventId: "evt-002", eventTitle: "Tarang Cultural Fest", date: "2026-10-09", timeSlot: "04:00 PM - 11:00 PM" }
    ]
  },
  {
    id: "ven-004",
    name: "Grand Executive Banquet Hall",
    category: "Banquet & Ballroom",
    capacity: 350,
    location: "Guest House Complex, 1st Floor",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
    amenities: ["Catering Serving Area", "Buffet Counters", "Round Table Seating", "Stage & Podium", "Chandelier Lighting"],
    status: "Available",
    hourlyRate: "₹3,800/hr",
    floorPlans: [
      { name: "Round Banquet Tables", capacity: 350, suitableFor: "Gala Dinners, Wedding Receptions, Alumni Meet" },
      { name: "Cocktail Standing Lounge", capacity: 420, suitableFor: "Networking Soirees, Sponsor Meet" }
    ],
    upcomingBookings: [
      { eventId: "evt-005", eventTitle: "Alumni Leadership Summit", date: "2026-11-12", timeSlot: "06:00 PM - 10:00 PM" }
    ]
  },
  {
    id: "ven-005",
    name: "Dr. APJ Abdul Kalam Seminar Hall",
    category: "Conference Room",
    capacity: 140,
    location: "Management Block, 2nd Floor",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80",
    amenities: ["Interactive Smartboard", "Video Conferencing Zoom Room", "Lavalier Mics", "Ergonomic Chairs"],
    status: "Available",
    hourlyRate: "₹1,800/hr",
    floorPlans: [
      { name: "U-Shape Executive", capacity: 60, suitableFor: "Board Meetings, Sponsor Negotiations" },
      { name: "Classroom Tiered", capacity: 140, suitableFor: "Workshops, Paper Presentations" }
    ],
    upcomingBookings: [
      { eventId: "evt-003", eventTitle: "Applied Generative AI Workshop", date: "2026-09-05", timeSlot: "10:00 AM - 04:00 PM" }
    ]
  }
];

export const mockResourceCategories = [
  {
    category: "Audiovisual & Tech Equipment",
    items: [
      { id: "res-av-1", name: "4K Laser Presentation Projector & Screen", total: 6, available: 4, costPerDay: "₹2,500" },
      { id: "res-av-2", name: "Wireless Collar & Handheld Mic Kit (4 Mics)", total: 12, available: 8, costPerDay: "₹1,200" },
      { id: "res-av-3", name: "Concert Line-Array PA Sound System (2000W)", total: 3, available: 2, costPerDay: "₹8,000" },
      { id: "res-av-4", name: "Multi-Cam Live Streaming Rig & Switcher", total: 4, available: 3, costPerDay: "₹5,000" }
    ]
  },
  {
    category: "Catering & Hospitality",
    items: [
      { id: "res-cat-1", name: "Delegate Buffet Lunch (Veg & Non-Veg Deluxe)", total: 1000, available: 850, costPerDay: "₹250/plate" },
      { id: "res-cat-2", name: "High-Tea & Snacks Kit (Cookies, Samosa, Chai)", total: 1500, available: 1200, costPerDay: "₹80/person" },
      { id: "res-cat-3", name: "VIP Executive Dining & Refreshments", total: 100, available: 75, costPerDay: "₹650/plate" },
      { id: "res-cat-4", name: "Packaged Mineral Water Stations (20L Cans)", total: 80, available: 60, costPerDay: "₹90/can" }
    ]
  },
  {
    category: "Stage, Decor & Fabrication",
    items: [
      { id: "res-dec-1", name: "LED Stage Backdrop Screen (24ft x 12ft)", total: 2, available: 1, costPerDay: "₹18,000" },
      { id: "res-dec-2", name: "Intelligent Moving-Head Stage Lighting Rig", total: 4, available: 2, costPerDay: "₹10,000" },
      { id: "res-dec-3", name: "Welcome Arch & Flex Signage Branding Set", total: 10, available: 7, costPerDay: "₹3,500" },
      { id: "res-dec-4", name: "Custom Exhibition Booth Canopies (10x10ft)", total: 25, available: 14, costPerDay: "₹1,500/booth" }
    ]
  },
  {
    category: "Human Resources & Event Staff",
    items: [
      { id: "res-stf-1", name: "Trained Student Volunteers (Registration & Ushering)", total: 60, available: 42, costPerDay: "Certificates + Refreshments" },
      { id: "res-stf-2", name: "Campus Security & Crowd Control Personnel", total: 20, available: 14, costPerDay: "₹1,200/officer" },
      { id: "res-stf-3", name: "Audio/Sound Engineer & Stage Tech Lead", total: 5, available: 3, costPerDay: "₹3,000/person" }
    ]
  }
];
