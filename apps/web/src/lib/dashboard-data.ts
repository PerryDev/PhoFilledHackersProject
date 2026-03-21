// apps/web/src/lib/dashboard-data.ts
// Seeded dashboard data and shared student metadata.
// Keeps the counselor UI deterministic and realistic without a live backend.
import { formatStableDate } from "@/lib/date-format";
import { extraStudents } from "@/lib/dashboard-extra-students";

export type StudentStage = "Early Builder" | "Pre-Applicant" | "Active Applicant";
export type AcademicStrengthBand = "Developing" | "Moderate" | "Strong" | "Very Strong";
export type TestReadinessBand = "Not Started" | "In Progress" | "Competitive" | "Highly Competitive";
export type ScholarshipNeed = "None" | "Low" | "Medium" | "High" | "Critical";
export type ScholarshipDependence = "Low" | "Medium" | "High";
export type AffordabilitySensitivity = "Flexible" | "Moderate" | "Sensitive" | "Highly Sensitive";
export type RecommendationTier = "Reach" | "Target" | "Safety";
export type ConfidenceLevel = "Low" | "Medium" | "High";
export type BudgetFit = "Within Budget" | "Stretch" | "Over Budget";
export type DeadlinePressure = "Low" | "Medium" | "High";

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
  tier: RecommendationTier;
  currentOutlook: string;
  projectedOutlook: string;
  confidenceLevel: ConfidenceLevel;
  budgetFit: BudgetFit;
  deadlinePressure: DeadlinePressure;
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
  testScores: { ielts?: string; toefl?: string; sat?: string; act?: string };
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
  scholarshipNeed: ScholarshipNeed;
  strategyMode: string;
  studentStage: StudentStage;
  academicStrengthBand: AcademicStrengthBand;
  testReadinessBand: TestReadinessBand;
  activityDepthSignal: string;
  leadershipSignal: string;
  scholarshipDependence: ScholarshipDependence;
  affordabilitySensitivity: AffordabilitySensitivity;
  handoffDate: string;
  chatSummary: string;
  bookingIntent?: { topic: string; timeWindow: string; status: "pending" | "confirmed" | "completed" };
  recommendations: { reach: SchoolRecommendation[]; target: SchoolRecommendation[]; safety: SchoolRecommendation[] };
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
    activities: "Founded coding club, hackathon organizer, robotics captain.",
    awards: "National Informatics Olympiad Bronze, Hackathon Vietnam Top 10.",
    leadership: "President of STEM Club, volunteer coordinator.",
    volunteering: "Tech literacy program for underprivileged students (100+ hrs).",
    projects: "AI study planner app and open-source contributions.",
    essayStatus: "Draft 1 complete.",
    recommendationLetters: "2 secured.",
    documentStatus: "Transcript ready, financial docs in progress.",
    geographicPreferences: ["Northeast US", "California"],
    campusType: "Urban",
    campusSize: "Large",
    targetAnnualBudget: "$45,000",
    maxStretchBudget: "$55,000",
    scholarshipNeed: "Medium",
    strategyMode: "Balanced mix of ED and RD",
    studentStage: "Active Applicant",
    academicStrengthBand: "Strong",
    testReadinessBand: "Competitive",
    activityDepthSignal: "Strong commitment with measurable impact.",
    leadershipSignal: "Strong leadership across STEM and service roles.",
    scholarshipDependence: "Medium",
    affordabilitySensitivity: "Moderate",
    handoffDate: "2026-03-18",
    chatSummary: "Highly motivated CS applicant balancing reach schools with financial safety nets.",
    bookingIntent: { topic: "ED strategy and school list finalization", timeWindow: "March 22-25, morning preferred", status: "pending" },
    recommendations: {
      reach: [{
        schoolName: "MIT", city: "Cambridge", state: "MA",
        tuitionAnnualUsd: 61990, estimatedCostOfAttendanceUsd: 85960,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Need-based aid meets full demonstrated need",
        lastVerifiedAt: "2026-02-15", sourceUrls: ["https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/"],
        tier: "Reach", currentOutlook: "Competitive", projectedOutlook: "Strong if SAT improves to 1520+",
        confidenceLevel: "Medium", budgetFit: "Stretch", deadlinePressure: "High",
        reasonsForFit: ["Strong CS extracurricular fit", "Olympiad background", "Upward GPA trend"],
        topBlockers: ["SAT slightly below median", "Need stronger research narrative"],
        nextActions: ["Retake SAT", "Develop research story", "Reference MIT-specific programs"],
      }],
      target: [{
        schoolName: "Georgia Tech", city: "Atlanta", state: "GA",
        tuitionAnnualUsd: 33794, estimatedCostOfAttendanceUsd: 53496,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Merit scholarships available for international students",
        lastVerifiedAt: "2026-03-01", sourceUrls: ["https://finaid.gatech.edu/costs/cost-attendance"],
        tier: "Target", currentOutlook: "Good", projectedOutlook: "Very Strong",
        confidenceLevel: "High", budgetFit: "Within Budget", deadlinePressure: "Low",
        reasonsForFit: ["Strong CS program", "Robotics and hackathon fit", "Co-op program alignment"],
        topBlockers: [], nextActions: ["Apply EA", "Research co-op details"],
      }],
      safety: [{
        schoolName: "Arizona State University", city: "Tempe", state: "AZ",
        tuitionAnnualUsd: 32076, estimatedCostOfAttendanceUsd: 48000,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Generous merit aid for international students",
        lastVerifiedAt: "2026-03-10", sourceUrls: ["https://students.asu.edu/international/costs"],
        tier: "Safety", currentOutlook: "Very Strong", projectedOutlook: "Very Strong",
        confidenceLevel: "High", budgetFit: "Within Budget", deadlinePressure: "Low",
        reasonsForFit: ["High acceptance rate", "Growing CS program", "Strong career services"],
        topBlockers: [], nextActions: ["Submit application early"],
      }],
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
    gpa: "3.72 / 4.0",
    gradeTrend: "Stable",
    intendedMajors: ["Business Administration", "Finance"],
    highSchool: "Le Hong Phong HCMC",
    testScores: { toefl: "105", sat: "1420" },
    activities: "FBLA finalist, school newspaper editor-in-chief, student council treasurer.",
    awards: "FBLA National Finalist, Best Delegate at HCMC MUN.",
    leadership: "VP of Entrepreneurship Club, Student Council Treasurer.",
    volunteering: "Financial literacy workshops for local communities (80+ hrs).",
    projects: "Micro-investment platform prototype.",
    essayStatus: "Final draft under review.",
    recommendationLetters: "3 secured.",
    documentStatus: "All documents submitted.",
    geographicPreferences: ["Northeast US", "Midwest"],
    campusType: "Urban",
    campusSize: "Large",
    targetAnnualBudget: "$50,000",
    maxStretchBudget: "$60,000",
    scholarshipNeed: "Low",
    strategyMode: "Aggressive ED2 focus",
    studentStage: "Active Applicant",
    academicStrengthBand: "Strong",
    testReadinessBand: "Competitive",
    activityDepthSignal: "Moderate breadth with a clear business focus.",
    leadershipSignal: "Moderate, but consistent across campus orgs.",
    scholarshipDependence: "Low",
    affordabilitySensitivity: "Flexible",
    handoffDate: "2026-03-17",
    chatSummary: "Anxious about deadlines and wants final school list confirmation.",
    recommendations: {
      reach: [{
        schoolName: "NYU Stern", city: "New York", state: "NY",
        tuitionAnnualUsd: 62192, estimatedCostOfAttendanceUsd: 88000,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Merit scholarships for top applicants",
        lastVerifiedAt: "2026-02-28", sourceUrls: ["https://www.nyu.edu/admissions/financial-aid-and-scholarships.html"],
        tier: "Reach", currentOutlook: "Competitive", projectedOutlook: "Moderate",
        confidenceLevel: "Medium", budgetFit: "Over Budget", deadlinePressure: "High",
        reasonsForFit: ["Global finance location", "IB background valued"], topBlockers: ["Need stronger Why NYU essay", "COA exceeds budget"],
        nextActions: ["Finalize supplements", "Apply for Stern scholarships"],
      }],
      target: [{
        schoolName: "Boston University", city: "Boston", state: "MA",
        tuitionAnnualUsd: 65168, estimatedCostOfAttendanceUsd: 86000,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Trustee and Presidential scholarships",
        lastVerifiedAt: "2026-03-01", sourceUrls: ["https://www.bu.edu/admissions/tuition-aid/"],
        tier: "Target", currentOutlook: "Good", projectedOutlook: "Strong",
        confidenceLevel: "High", budgetFit: "Stretch", deadlinePressure: "High",
        reasonsForFit: ["Questrom business school", "Urban campus", "IB-friendly"], topBlockers: [],
        nextActions: ["Submit RD application", "Apply for merit scholarships"],
      }],
      safety: [{
        schoolName: "Indiana University Kelley", city: "Bloomington", state: "IN",
        tuitionAnnualUsd: 40482, estimatedCostOfAttendanceUsd: 55000,
        scholarshipAvailabilityFlag: true, scholarshipNotes: "Automatic merit aid for qualifying students",
        lastVerifiedAt: "2026-03-08", sourceUrls: ["https://admissions.indiana.edu/cost-financial-aid/"],
        tier: "Safety", currentOutlook: "Very Strong", projectedOutlook: "Very Strong",
        confidenceLevel: "High", budgetFit: "Within Budget", deadlinePressure: "Low",
        reasonsForFit: ["Top-ranked business program", "Strong placement rates", "Affordable"], topBlockers: [],
        nextActions: ["Apply for direct admit to Kelley"],
      }],
    },
  },
  ...extraStudents,
];

export function getStudentById(id: string) {
  return students.find((student) => student.id === id);
}

export function formatTuitionPair(schoolRecommendation: SchoolRecommendation) {
  return `$${Math.round(schoolRecommendation.tuitionAnnualUsd / 1000)}k / $${Math.round(schoolRecommendation.estimatedCostOfAttendanceUsd / 1000)}k`;
}

export function formatHandOffDate(value: string) {
  return formatStableDate(value);
}
