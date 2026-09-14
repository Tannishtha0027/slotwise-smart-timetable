const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.utils.book_new();

// TimeSlots
const tsData = [
  { id: 'TS1', date: '2026-10-01', start_time: '09:00:00', end_time: '11:00:00', duration_minutes: 120 },
  { id: 'TS2', date: '2026-10-01', start_time: '13:00:00', end_time: '15:00:00', duration_minutes: 120 },
  { id: 'TS3', date: '2026-10-02', start_time: '09:00:00', end_time: '11:00:00', duration_minutes: 120 }
];
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tsData), 'TimeSlots');

// Rooms
const roomData = [
  { id: 'R101', capacity: 2, building: 'Main', available_slots: 'TS1, TS2, TS3' },
  { id: 'R102', capacity: 5, building: 'Main', available_slots: 'TS1, TS2, TS3' }
];
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(roomData), 'Rooms');

// Faculty
const facultyData = [
  { id: 'F1', name: 'Prof. Smith', max_invigilations_per_day: 2, available_slots: 'TS1, TS2, TS3' },
  { id: 'F2', name: 'Prof. Johnson', max_invigilations_per_day: 1, available_slots: 'TS1, TS3' }
];
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(facultyData), 'Faculty');

// Exams
const examData = [
  { id: 'CS101', course_name: 'Intro to CS', duration_minutes: 120, required_invigilators: 1 },
  { id: 'CS102', course_name: 'Data Structures', duration_minutes: 120, required_invigilators: 1 },
  { id: 'MATH201', course_name: 'Calculus', duration_minutes: 90, required_invigilators: 1 }
];
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(examData), 'Exams');

// Students
const studentData = [
  { id: 'S1', batch: 'CS-2026', enrolled_exams: 'CS101, MATH201' },
  { id: 'S2', batch: 'CS-2026', enrolled_exams: 'CS101' },
  { id: 'S3', batch: 'CS-2026', enrolled_exams: 'CS101, CS102' },
  { id: 'S4', batch: 'CS-2026', enrolled_exams: 'CS102, MATH201' },
  { id: 'S5', batch: 'CS-2026', enrolled_exams: 'CS102' }
];
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(studentData), 'Students');

xlsx.writeFile(wb, 'test_sample_data.xlsx');
console.log('test_sample_data.xlsx created.');
