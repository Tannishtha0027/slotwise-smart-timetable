import { read, utils } from 'xlsx';
import type { CollegeData, TimeSlot, Room, Faculty, Exam, Student } from '../types/api';

export class ParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParserError';
  }
}

export async function parseExcelToCollegeData(file: File): Promise<CollegeData> {
  const buffer = await file.arrayBuffer();
  // We use standard reading, relying on raw: false in sheet_to_json to get the formatted text
  const wb = read(buffer, { type: 'array' });

  const requiredSheets = ['TimeSlots', 'Rooms', 'Faculty', 'Exams', 'Students'];
  for (const s of requiredSheets) {
    if (!wb.SheetNames.includes(s)) {
      throw new ParserError(`Missing required sheet: ${s}`);
    }
  }

  const parseCSVList = (val: any) => {
    if (val === undefined || val === null || val === '') return [];
    return String(val).split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const parseString = (val: any): string => {
    if (val === undefined || val === null) return '';
    return String(val).trim();
  };

  // 1. TimeSlots
  const tsRaw = utils.sheet_to_json<any>(wb.Sheets['TimeSlots'], { raw: false });
  const time_slots: TimeSlot[] = [];
  const tsIds = new Set<string>();

  for (let i = 0; i < tsRaw.length; i++) {
    const row = tsRaw[i];
    const id = parseString(row.id);
    const dateStr = parseString(row.date);
    const startTimeStr = parseString(row.start_time);
    const endTimeStr = parseString(row.end_time);

    if (!id || !dateStr || !startTimeStr || !endTimeStr || !row.duration_minutes) {
      throw new ParserError(`Missing required column in TimeSlots row ${i + 2}. Required: id, date, start_time, end_time, duration_minutes.`);
    }
    const duration = parseInt(row.duration_minutes);
    if (isNaN(duration) || duration <= 0) {
      throw new ParserError(`Invalid duration_minutes in TimeSlots row ${i + 2}.`);
    }
    if (tsIds.has(id)) {
      throw new ParserError(`Duplicate TimeSlot ID found: ${id}`);
    }
    tsIds.add(id);
    time_slots.push({
      id: id,
      date: dateStr,
      start_time: startTimeStr,
      end_time: endTimeStr,
      duration_minutes: duration
    });
  }

  // 2. Exams
  const examsRaw = utils.sheet_to_json<any>(wb.Sheets['Exams'], { raw: false });
  const exams: Exam[] = [];
  const examIds = new Set<string>();

  for (let i = 0; i < examsRaw.length; i++) {
    const row = examsRaw[i];
    if (!row.id || !row.course_name || !row.duration_minutes) {
      throw new ParserError(`Missing required column in Exams row ${i + 2}. Required: id, course_name, duration_minutes.`);
    }
    const duration = parseInt(row.duration_minutes);
    if (isNaN(duration) || duration <= 0) {
      throw new ParserError(`Invalid duration_minutes in Exams row ${i + 2}.`);
    }
    const reqInvig = row.required_invigilators !== undefined ? parseInt(row.required_invigilators) : 1;
    if (isNaN(reqInvig) || reqInvig <= 0) {
      throw new ParserError(`Invalid required_invigilators in Exams row ${i + 2}.`);
    }
    if (examIds.has(String(row.id))) {
      throw new ParserError(`Duplicate Exam ID found: ${row.id}`);
    }
    examIds.add(String(row.id));
    exams.push({
      id: String(row.id),
      course_name: String(row.course_name),
      duration_minutes: duration,
      required_invigilators: reqInvig,
      enrolled_students: [] // Populated later
    });
  }

  // 3. Students
  const studentsRaw = utils.sheet_to_json<any>(wb.Sheets['Students'], { raw: false });
  const students: Student[] = [];
  const studentIds = new Set<string>();

  for (let i = 0; i < studentsRaw.length; i++) {
    const row = studentsRaw[i];
    if (!row.id || !row.batch) {
      throw new ParserError(`Missing required column in Students row ${i + 2}. Required: id, batch.`);
    }
    if (studentIds.has(String(row.id))) {
      throw new ParserError(`Duplicate Student ID found: ${row.id}`);
    }
    studentIds.add(String(row.id));
    
    // Some students may not have enrolled_exams, but let's assume it's valid to be empty
    const enrolled_exams = parseCSVList(row.enrolled_exams);
    
    // Reverse engineer exam.enrolled_students
    for (const exId of enrolled_exams) {
      if (!examIds.has(exId)) {
        throw new ParserError(`Student ${row.id} references unknown exam: ${exId}`);
      }
      const exam = exams.find(e => e.id === exId);
      if (exam && !exam.enrolled_students.includes(String(row.id))) {
        exam.enrolled_students.push(String(row.id));
      }
    }

    students.push({
      id: String(row.id),
      batch: String(row.batch),
      enrolled_exams
    });
  }

  // 4. Rooms
  const roomsRaw = utils.sheet_to_json<any>(wb.Sheets['Rooms'], { raw: false });
  const rooms: Room[] = [];
  const roomIds = new Set<string>();

  for (let i = 0; i < roomsRaw.length; i++) {
    const row = roomsRaw[i];
    if (!row.id || row.capacity === undefined || row.capacity === null || row.capacity === '') {
      throw new ParserError(`Missing required column in Rooms row ${i + 2}. Required: id, capacity.`);
    }
    const cap = parseInt(row.capacity);
    if (isNaN(cap) || cap <= 0) {
      throw new ParserError(`Invalid capacity in Rooms row ${i + 2}.`);
    }
    if (roomIds.has(String(row.id))) {
      throw new ParserError(`Duplicate Room ID found: ${row.id}`);
    }
    roomIds.add(String(row.id));

    const available_slots = parseCSVList(row.available_slots);
    for (const tsId of available_slots) {
      if (!tsIds.has(tsId)) {
        throw new ParserError(`Room ${row.id} references unknown time slot: ${tsId}`);
      }
    }

    rooms.push({
      id: String(row.id),
      capacity: cap,
      building: row.building ? String(row.building) : undefined,
      available_slots
    });
  }

  // 5. Faculty
  const facultyRaw = utils.sheet_to_json<any>(wb.Sheets['Faculty'], { raw: false });
  const faculty: Faculty[] = [];
  const facultyIds = new Set<string>();

  for (let i = 0; i < facultyRaw.length; i++) {
    const row = facultyRaw[i];
    if (!row.id || !row.name) {
      throw new ParserError(`Missing required column in Faculty row ${i + 2}. Required: id, name.`);
    }
    if (facultyIds.has(String(row.id))) {
      throw new ParserError(`Duplicate Faculty ID found: ${row.id}`);
    }
    facultyIds.add(String(row.id));

    const available_slots = parseCSVList(row.available_slots);
    for (const tsId of available_slots) {
      if (!tsIds.has(tsId)) {
        throw new ParserError(`Faculty ${row.id} references unknown time slot: ${tsId}`);
      }
    }

    let max_invig: number | undefined = undefined;
    if (row.max_invigilations_per_day !== undefined && row.max_invigilations_per_day !== null && row.max_invigilations_per_day !== '') {
      max_invig = parseInt(row.max_invigilations_per_day);
      if (isNaN(max_invig) || max_invig <= 0) {
        throw new ParserError(`Invalid max_invigilations_per_day in Faculty row ${i + 2}.`);
      }
    }

    let total_invig: number | undefined = undefined;
    if (row.total_invigilations_target !== undefined && row.total_invigilations_target !== null && row.total_invigilations_target !== '') {
      total_invig = parseInt(row.total_invigilations_target);
    }

    faculty.push({
      id: String(row.id),
      name: String(row.name),
      available_slots,
      max_invigilations_per_day: max_invig,
      total_invigilations_target: total_invig
    });
  }

  return { time_slots, rooms, faculty, exams, students };
}
