export interface SchoolRecommendation {
  schoolName: string;
  city: string;
  state: string;
  tuitionAnnualUsd: number;
  estimatedCostOfAttendanceUsd: number;
  scholarshipAvailabilityFlag: boolean;
  scholarshipNotes?: string;
  lastVerifiedAt: string;
  sourceUrls: string[];
  tier: "Reach" | "Target" | "Safety";
  currentOutlook: string;
  projectedOutlook: string;
  confidenceLevel: "Low" | "Medium" | "High";
  budgetFit: "Within Budget" | "Stretch" | "Over Budget";
  deadlinePressure: "Low" | "Medium" | "High";
  reasonsForFit: string[];
  topBlockers: string[];
  nextActions: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gradeLevel: number;
  graduationYear: number;
  curriculum: string;
  gpa: string;
  gradeTrend: "Upward" | "Stable" | "Downward";
  intendedMajors: string[];
  highSchool: string;
  testScores: {
    ielts?: string;
    toefl?: string;
    sat?: string;
    act?: string;
  };
  activities: string;
  awards: string;
  leadership: string;
  volunteering: string;
  projects: string;
  essayStatus: string;
  recommendationLetters: string;
  documentStatus: string;
  geographicPreferences: string[];
  campusType: string;
  campusSize: string;
  targetAnnualBudget: string;
  maxStretchBudget: string;
  scholarshipNeed: "None" | "Low" | "Medium" | "High" | "Critical";
  strategyMode: string;
  studentStage: "Early Builder" | "Pre-Applicant" | "Active Applicant";
  academicStrengthBand: "Developing" | "Moderate" | "Strong" | "Very Strong";
  testReadinessBand:
    | "Not Started"
    | "In Progress"
    | "Competitive"
    | "Highly Competitive";
  activityDepthSignal: string;
  leadershipSignal: string;
  scholarshipDependence: "Low" | "Medium" | "High";
  affordabilitySensitivity:
    | "Flexible"
    | "Moderate"
    | "Sensitive"
    | "Highly Sensitive";
  handoffDate: string;
  chatSummary: string;
  bookingIntent?: {
    topic: string;
    timeWindow: string;
    status: "pending" | "confirmed" | "completed";
  };
  recommendations: {
    reach: SchoolRecommendation[];
    target: SchoolRecommendation[];
    safety: SchoolRecommendation[];
  };
}

export const students: StudentProfile[] = [
  {
    id: "1",
    name: "Nguyen Minh Anh",
    email: "minhanh.nguyen@gmail.com",
    phone: "+84 912 345 678",
    gradeLevel: 11,
    graduationYear: 2027,
    curriculum: "Vietnamese National + AP",
    gpa: "3.87 / 4.0",
    gradeTrend: "Upward",
    intendedMajors: ["Computer Science", "Data Science"],
    highSchool: "Hanoi-Amsterdam High School",
    testScores: { ielts: "7.5", sat: "1480" },
    activities:
      "Founded coding club (50+ members), hackathon organizer, robotics team captain, competitive programming",
    awards:
      "National Informatics Olympiad Bronze, Hackathon Vietnam Top 10",
    leadership:
      "President of STEM Club, Volunteer coordinator at local NGO",
    volunteering:
      "Tech literacy program for underprivileged students (100+ hrs)",
    projects:
      "AI-powered study planner app (500+ downloads), open-source contributions",
    essayStatus: "Draft 1 complete for Common App personal statement",
    recommendationLetters: "2 secured (CS teacher, club advisor)",
    documentStatus: "Transcript ready, financial documents in progress",
    geographicPreferences: ["Northeast US", "California"],
    campusType: "Urban",
    campusSize: "Large",
    targetAnnualBudget: "$45,000",
    maxStretchBudget: "$55,000",
    scholarshipNeed: "Medium",
    strategyMode: "Balanced - mix of ED and RD",
    studentStage: "Active Applicant",
    academicStrengthBand: "Strong",
    testReadinessBand: "Competitive",
    activityDepthSignal:
      "Strong - multiple sustained commitments with measurable impact",
    leadershipSignal:
      "Strong - leadership in 3+ organizations with clear initiative",
    scholarshipDependence: "Medium",
    affordabilitySensitivity: "Moderate",
    handoffDate: "2026-03-18",
    chatSummary:
      "Student is highly motivated and focused on CS programs with strong research opportunities. Primary concern is balancing reach schools with financial safety nets. Interested in co-op and internship-heavy programs and wants guidance on an early decision strategy.",
    bookingIntent: {
      topic: "ED strategy and school list finalization",
      timeWindow: "March 22-25, Morning preferred",
      status: "pending",
    },
    recommendations: {
      reach: [
        {
          schoolName: "MIT",
          city: "Cambridge",
          state: "MA",
          tuitionAnnualUsd: 61990,
          estimatedCostOfAttendanceUsd: 85960,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes: "Need-based aid meets 100% demonstrated need",
          lastVerifiedAt: "2026-02-15",
          sourceUrls: [
            "https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/",
          ],
          tier: "Reach",
          currentOutlook: "Competitive",
          projectedOutlook: "Strong if SAT improves to 1520+",
          confidenceLevel: "Medium",
          budgetFit: "Stretch",
          deadlinePressure: "High",
          reasonsForFit: [
            "Strong CS extracurriculars align with MIT culture",
            "Olympiad background demonstrates problem-solving",
            "Upward GPA trend",
          ],
          topBlockers: [
            "SAT score slightly below median",
            "Need stronger research narrative in essays",
          ],
          nextActions: [
            "Retake SAT targeting 1520+",
            "Develop research story for personal statement",
          ],
        },
      ],
      target: [
        {
          schoolName: "Georgia Tech",
          city: "Atlanta",
          state: "GA",
          tuitionAnnualUsd: 33794,
          estimatedCostOfAttendanceUsd: 53496,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Merit scholarships available for international students",
          lastVerifiedAt: "2026-03-01",
          sourceUrls: ["https://finaid.gatech.edu/costs/cost-attendance"],
          tier: "Target",
          currentOutlook: "Good",
          projectedOutlook: "Very Strong",
          confidenceLevel: "High",
          budgetFit: "Within Budget",
          deadlinePressure: "Low",
          reasonsForFit: [
            "Strong CS program ranked top 10",
            "Robotics and hackathon experience are a fit",
            "Co-op program aligns with interest",
          ],
          topBlockers: [],
          nextActions: [
            "Apply EA for best chances",
            "Research co-op program details for essay",
          ],
        },
        {
          schoolName: "UIUC",
          city: "Champaign",
          state: "IL",
          tuitionAnnualUsd: 38710,
          estimatedCostOfAttendanceUsd: 56000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes: "CS department scholarships available",
          lastVerifiedAt: "2026-03-05",
          sourceUrls: ["https://cs.illinois.edu/admissions/undergraduate"],
          tier: "Target",
          currentOutlook: "Good",
          projectedOutlook: "Strong",
          confidenceLevel: "High",
          budgetFit: "Stretch",
          deadlinePressure: "Low",
          reasonsForFit: [
            "Top 5 CS program",
            "Strong competitive programming culture",
          ],
          topBlockers: ["CS direct admit is competitive"],
          nextActions: [
            "Apply early for direct CS admission",
            "Highlight competitive programming achievements",
          ],
        },
      ],
      safety: [
        {
          schoolName: "Arizona State University",
          city: "Tempe",
          state: "AZ",
          tuitionAnnualUsd: 32076,
          estimatedCostOfAttendanceUsd: 48000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Generous merit aid for international students with strong academics",
          lastVerifiedAt: "2026-03-10",
          sourceUrls: ["https://students.asu.edu/international/costs"],
          tier: "Safety",
          currentOutlook: "Very Strong",
          projectedOutlook: "Very Strong",
          confidenceLevel: "High",
          budgetFit: "Within Budget",
          deadlinePressure: "Low",
          reasonsForFit: [
            "High acceptance rate with merit aid",
            "Growing CS program",
            "Strong career services",
          ],
          topBlockers: [],
          nextActions: [
            "Submit application for automatic merit scholarship consideration",
          ],
        },
      ],
    },
  },
  {
    id: "2",
    name: "Tran Bao Ngoc",
    email: "bngoc.tran@outlook.com",
    phone: "+84 903 456 789",
    gradeLevel: 12,
    graduationYear: 2026,
    curriculum: "IB Diploma",
    gpa: "3.72 / 4.0 (IB predicted: 38/45)",
    gradeTrend: "Stable",
    intendedMajors: ["Business Administration", "Finance"],
    highSchool: "Le Hong Phong HCMC",
    testScores: { toefl: "105", sat: "1420" },
    activities:
      "Business competition finalist, school newspaper editor-in-chief, student council treasurer",
    awards: "FBLA National Finalist, Best Delegate at HCMC MUN",
    leadership: "VP of Entrepreneurship Club, Student Council Treasurer",
    volunteering: "Financial literacy workshops for local communities",
    projects: "Micro-investment platform prototype as school capstone",
    essayStatus: "Final draft under review",
    recommendationLetters:
      "3 secured (IB coordinator, economics teacher, club advisor)",
    documentStatus: "All documents submitted",
    geographicPreferences: ["Northeast US", "Midwest"],
    campusType: "Urban",
    campusSize: "Large",
    targetAnnualBudget: "$50,000",
    maxStretchBudget: "$60,000",
    scholarshipNeed: "Low",
    strategyMode: "Aggressive - ED2 focus",
    studentStage: "Active Applicant",
    academicStrengthBand: "Strong",
    testReadinessBand: "Competitive",
    activityDepthSignal:
      "Moderate - good breadth but could deepen business focus",
    leadershipSignal: "Moderate - VP and treasurer roles show initiative",
    scholarshipDependence: "Low",
    affordabilitySensitivity: "Flexible",
    handoffDate: "2026-03-17",
    chatSummary:
      "Student is anxious about upcoming deadlines for Round 2 applications and wants confirmation on the school list plus final essay review. Parents are supportive of the budget and want clarity on merit scholarship options.",
    bookingIntent: {
      topic: "Urgent deadline review",
      timeWindow: "ASAP - next 48 hours",
      status: "pending",
    },
    recommendations: {
      reach: [
        {
          schoolName: "NYU Stern",
          city: "New York",
          state: "NY",
          tuitionAnnualUsd: 62192,
          estimatedCostOfAttendanceUsd: 88000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes: "Merit scholarships for top applicants",
          lastVerifiedAt: "2026-02-28",
          sourceUrls: [
            "https://www.nyu.edu/admissions/financial-aid-and-scholarships.html",
          ],
          tier: "Reach",
          currentOutlook: "Competitive",
          projectedOutlook: "Moderate - strong Why NYU essay needed",
          confidenceLevel: "Medium",
          budgetFit: "Over Budget",
          deadlinePressure: "High",
          reasonsForFit: [
            "Strong business program in global financial capital",
            "IB background valued",
          ],
          topBlockers: [
            "Need to finalize Why NYU essay",
            "COA exceeds max budget without scholarship",
          ],
          nextActions: [
            "Finalize supplemental essays ASAP",
            "Apply for Stern scholarship",
          ],
        },
      ],
      target: [
        {
          schoolName: "Boston University",
          city: "Boston",
          state: "MA",
          tuitionAnnualUsd: 65168,
          estimatedCostOfAttendanceUsd: 86000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes: "Trustee and Presidential scholarships",
          lastVerifiedAt: "2026-03-01",
          sourceUrls: ["https://www.bu.edu/admissions/tuition-aid/"],
          tier: "Target",
          currentOutlook: "Good",
          projectedOutlook: "Strong",
          confidenceLevel: "High",
          budgetFit: "Stretch",
          deadlinePressure: "High",
          reasonsForFit: [
            "Strong Questrom business school",
            "Urban campus matches preference",
            "IB-friendly",
          ],
          topBlockers: [],
          nextActions: [
            "Submit RD application before deadline",
            "Apply for merit scholarships",
          ],
        },
        {
          schoolName: "UW-Madison",
          city: "Madison",
          state: "WI",
          tuitionAnnualUsd: 40603,
          estimatedCostOfAttendanceUsd: 58000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "International merit scholarships available",
          lastVerifiedAt: "2026-03-05",
          sourceUrls: ["https://financialaid.wisc.edu/cost-of-attendance/"],
          tier: "Target",
          currentOutlook: "Good",
          projectedOutlook: "Strong",
          confidenceLevel: "High",
          budgetFit: "Within Budget",
          deadlinePressure: "Medium",
          reasonsForFit: [
            "Strong business school",
            "Good international student support",
          ],
          topBlockers: [],
          nextActions: [
            "Submit application",
            "Research honors and scholarship options",
          ],
        },
      ],
      safety: [
        {
          schoolName: "Indiana University Kelley",
          city: "Bloomington",
          state: "IN",
          tuitionAnnualUsd: 40482,
          estimatedCostOfAttendanceUsd: 55000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Automatic merit aid for qualifying students",
          lastVerifiedAt: "2026-03-08",
          sourceUrls: ["https://admissions.indiana.edu/cost-financial-aid/"],
          tier: "Safety",
          currentOutlook: "Very Strong",
          projectedOutlook: "Very Strong",
          confidenceLevel: "High",
          budgetFit: "Within Budget",
          deadlinePressure: "Low",
          reasonsForFit: [
            "Top-ranked undergraduate business program",
            "Strong placement rates",
            "Affordable",
          ],
          topBlockers: [],
          nextActions: ["Apply for direct admit to Kelley School"],
        },
      ],
    },
  },
  {
    id: "3",
    name: "Pham Thu Ha",
    email: "thuha.pham@yahoo.com",
    phone: "+84 976 543 210",
    gradeLevel: 11,
    graduationYear: 2027,
    curriculum: "Vietnamese National + Cambridge IGCSE",
    gpa: "3.65 / 4.0",
    gradeTrend: "Stable",
    intendedMajors: ["Psychology", "Cognitive Science"],
    highSchool: "Chu Van An High School",
    testScores: { ielts: "7.0" },
    activities:
      "Mental health awareness club founder, peer counselor, debate team, psychology reading group",
    awards:
      "National Debate Tournament Top 20, School Psychology Essay Prize",
    leadership:
      "Founded school's first mental health club, debate team captain",
    volunteering: "Peer counseling hotline volunteer, youth mental health NGO",
    projects:
      "Mental health awareness campaign reaching 1,000+ students",
    essayStatus:
      "Brainstorming phase - strong personal narrative identified",
    recommendationLetters:
      "1 secured (debate coach), need 1 more",
    documentStatus:
      "Transcript available, need to request IGCSE certificates",
    geographicPreferences: ["California", "Pacific Northwest"],
    campusType: "Urban or Suburban",
    campusSize: "Medium to Large",
    targetAnnualBudget: "$40,000",
    maxStretchBudget: "$48,000",
    scholarshipNeed: "High",
    strategyMode: "Balanced - targeting merit scholarships",
    studentStage: "Pre-Applicant",
    academicStrengthBand: "Moderate",
    testReadinessBand: "Competitive",
    activityDepthSignal:
      "Strong - deep commitment to mental health advocacy with measurable reach",
    leadershipSignal:
      "Strong - founder role with clear community impact",
    scholarshipDependence: "High",
    affordabilitySensitivity: "Sensitive",
    handoffDate: "2026-03-19",
    chatSummary:
      "Student has a compelling personal story related to mental health advocacy. Needs help identifying psychology programs with strong clinical training components and scholarship pathways that fit a tighter budget.",
    recommendations: {
      reach: [
        {
          schoolName: "UCLA",
          city: "Los Angeles",
          state: "CA",
          tuitionAnnualUsd: 46326,
          estimatedCostOfAttendanceUsd: 70000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Limited merit aid for OOS and international students",
          lastVerifiedAt: "2026-02-28",
          sourceUrls: ["https://admission.ucla.edu/tuition-aid"],
          tier: "Reach",
          currentOutlook: "Competitive",
          projectedOutlook: "Moderate - strong fit with advocacy narrative",
          confidenceLevel: "Medium",
          budgetFit: "Over Budget",
          deadlinePressure: "Medium",
          reasonsForFit: [
            "Top psychology program",
            "Location matches preference",
            "Strong research opportunities",
          ],
          topBlockers: [
            "GPA below median for international admits",
            "Limited financial aid",
          ],
          nextActions: [
            "Strengthen GPA in remaining semesters",
            "Develop UCLA-specific research interest essay",
          ],
        },
      ],
      target: [
        {
          schoolName: "University of Washington",
          city: "Seattle",
          state: "WA",
          tuitionAnnualUsd: 42099,
          estimatedCostOfAttendanceUsd: 58000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Some merit scholarships for international students",
          lastVerifiedAt: "2026-03-01",
          sourceUrls: [
            "https://admit.washington.edu/costs/cost-of-attendance/",
          ],
          tier: "Target",
          currentOutlook: "Moderate",
          projectedOutlook: "Good with improved test scores",
          confidenceLevel: "Medium",
          budgetFit: "Stretch",
          deadlinePressure: "Medium",
          reasonsForFit: [
            "Strong psychology department",
            "Pacific Northwest location matches preference",
          ],
          topBlockers: ["Need to strengthen standardized test profile"],
          nextActions: [
            "Consider taking SAT",
            "Research UW psychology honors program",
          ],
        },
      ],
      safety: [
        {
          schoolName: "Oregon State University",
          city: "Corvallis",
          state: "OR",
          tuitionAnnualUsd: 33012,
          estimatedCostOfAttendanceUsd: 46000,
          scholarshipAvailabilityFlag: true,
          scholarshipNotes:
            "Provost's Excellence Award for international students",
          lastVerifiedAt: "2026-03-08",
          sourceUrls: [
            "https://admissions.oregonstate.edu/international-scholarships",
          ],
          tier: "Safety",
          currentOutlook: "Strong",
          projectedOutlook: "Very Strong",
          confidenceLevel: "High",
          budgetFit: "Within Budget",
          deadlinePressure: "Low",
          reasonsForFit: [
            "Affordable with scholarships",
            "Good psychology program",
            "Supportive international community",
          ],
          topBlockers: [],
          nextActions: [
            "Apply for Provost's Excellence Award",
            "Submit application early",
          ],
        },
      ],
    },
  },
];
