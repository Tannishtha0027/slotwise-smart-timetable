export interface TimeSlot {
  id: string;
  date: string; // date format e.g. "YYYY-MM-DD"
  start_time: string; // time format e.g. "HH:MM:SS"
  end_time: string;
  duration_minutes: number;
}

export interface Room {
  id: string;
  capacity: number;
  building?: string | null;
  available_slots: string[];
}

export interface Faculty {
  id: string;
  name: string;
  available_slots: string[];
  max_invigilations_per_day?: number | null;
  total_invigilations_target?: number | null;
}

export interface Student {
  id: string;
  batch: string;
  enrolled_exams: string[];
}

export interface Exam {
  id: string;
  course_name: string;
  duration_minutes: number;
  enrolled_students: string[];
  required_invigilators?: number;
}

export interface CollegeData {
  time_slots: TimeSlot[];
  rooms: Room[];
  faculty: Faculty[];
  exams: Exam[];
  students: Student[];
}

export type ViolationType =
  | "ROOM_CAPACITY"
  | "ROOM_UNAVAILABLE"
  | "ROOM_COLLISION"
  | "FACULTY_UNAVAILABLE"
  | "FACULTY_DOUBLE_BOOKED"
  | "STUDENT_CONFLICT"
  | "MISSING_ASSIGNMENT"
  | "EXTRA_ASSIGNMENT"
  | "INVIGILATOR_COUNT"
  | "INVALID_ROOM"
  | "INVALID_FACULTY"
  | "INVALID_TIME_SLOT";

export interface Violation {
  type: ViolationType;
  severity?: string;
  affected_exams: string[];
  affected_room?: string | null;
  affected_faculty?: string | null;
  time_slot?: string | null;
  message: string;
}

export interface ValidationResult {
  is_valid: boolean;
  violations: Violation[];
}

export interface ExamAssignment {
  time_slot_id: string;
  room_id: string;
  faculty_ids: string[];
}

export interface TimetableResult {
  status: string;
  assignments: Record<string, ExamAssignment>;
  objective_value?: number | null;
  quality_score?: number | null;
  student_comfort_score?: number | null;
  room_efficiency_score?: number | null;
  metrics?: Record<string, any>;
  validation?: ValidationResult | null;
}
