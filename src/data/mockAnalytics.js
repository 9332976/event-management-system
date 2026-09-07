export const mockAnalytics = {
  // Monthly registrations trend
  monthlyRegistrations: [
    { month: "Apr", registrations: 420, attendees: 380 },
    { month: "May", registrations: 580, attendees: 510 },
    { month: "Jun", registrations: 720, attendees: 660 },
    { month: "Jul", registrations: 950, attendees: 890 },
    { month: "Aug", registrations: 1420, attendees: 1290 },
    { month: "Sep", registrations: 2150, attendees: 1980 },
    { month: "Oct", registrations: 2500, attendees: 2320 },
  ],

  // Events by category distribution (Pie / Donut chart)
  categoryDistribution: [
    { name: "Technical", value: 8, color: "#4F46E5" },
    { name: "Cultural", value: 6, color: "#EC4899" },
    { name: "Workshop", value: 7, color: "#F59E0B" },
    { name: "Hackathon", value: 5, color: "#8B5CF6" },
    { name: "Sports", value: 5, color: "#10B981" },
    { name: "Seminar", value: 4, color: "#06B6D4" },
    { name: "Competition", value: 6, color: "#EF4444" },
    { name: "Club Activities", value: 9, color: "#14B8A6" },
  ],

  // Attendance breakdown by department (Bar chart)
  departmentAttendance: [
    { department: "CSE", registered: 450, present: 412, absent: 38 },
    { department: "ECE", registered: 320, present: 290, absent: 30 },
    { department: "MECH", registered: 210, present: 185, absent: 25 },
    { department: "CIVIL", registered: 140, present: 120, absent: 20 },
    { department: "BIO-TECH", registered: 180, present: 168, absent: 12 },
    { department: "MGMT", registered: 260, present: 235, absent: 25 },
  ],

  // Organizer specific stats
  organizerStats: {
    totalEvents: 6,
    upcomingEvents: 3,
    totalParticipants: 840,
    attendanceRate: 92.4,
    revenueGenerated: "₹65,000"
  },

  // Admin university-wide stats
  adminStats: {
    totalUsers: 2580,
    totalStudents: 2340,
    totalOrganizers: 54,
    totalEvents: 124,
    totalRegistrations: 4890,
    activeClubs: 38,
    overallAttendanceRate: 89.6
  },

  // Student testimonials
  testimonials: [
    {
      id: 1,
      name: "Tanvi Saxena",
      department: "B.Tech Computer Science (3rd Year)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote: "CampusConnect changed how our clubs host hackathons. Instant registration passes, zero check-in lines with the digital QR, and live updates made participating in InnovateX completely effortless!",
      rating: 5,
      event: "InnovateX Hackathon Winner"
    },
    {
      id: 2,
      name: "Vikrant Deshmukh",
      department: "B.E. Mechanical & Sports Captain",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      quote: "Managing 16 collegiate teams in the Cricket League used to be an administrative nightmare. With CampusConnect, fixtures, live registrations, and team credentials were ready in seconds.",
      rating: 5,
      event: "Cricket Premier League Coordinator"
    },
    {
      id: 3,
      name: "Roshni Sen",
      department: "M.Sc Biotechnology & Cultural Secretary",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      quote: "The visual schedule and instant ticket pass downloads are gorgeous. Our cultural fest Tarang had record footfalls and zero ticketing confusions!",
      rating: 5,
      event: "Tarang Cultural Fest Lead"
    },
    {
      id: 4,
      name: "Karan Johar B.",
      department: "B.Tech Electronics & Robotics Lead",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      quote: "The live attendance and participant rosters make event day check-ins effortless for organizers. A gold-standard campus platform.",
      rating: 5,
      event: "RoboWars Organizer"
    }
  ]
};
