const xlsx = require('xlsx');

// 1. Missing Exams sheet
const wb1 = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb1, xlsx.utils.json_to_sheet([{id: 'TS1'}]), 'TimeSlots');
xlsx.utils.book_append_sheet(wb1, xlsx.utils.json_to_sheet([{id: 'R1'}]), 'Rooms');
xlsx.utils.book_append_sheet(wb1, xlsx.utils.json_to_sheet([{id: 'F1'}]), 'Faculty');
xlsx.utils.book_append_sheet(wb1, xlsx.utils.json_to_sheet([{id: 'S1'}]), 'Students');
xlsx.writeFile(wb1, 'bad_missing_sheet.xlsx');

// 2. Missing required column
const wb2 = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet([{id: 'TS1', date: '2026', start_time: '9', end_time: '10', duration_minutes: 60}]), 'TimeSlots');
xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet([{id: 'R1', capacity: 10}]), 'Rooms');
xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet([{id: 'F1', name: 'A'}]), 'Faculty');
xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet([{id: 'S1', batch: '2026'}]), 'Students');
xlsx.utils.book_append_sheet(wb2, xlsx.utils.json_to_sheet([{id: 'CS101', duration_minutes: 60}]), 'Exams'); // missing course_name
xlsx.writeFile(wb2, 'bad_missing_column.xlsx');

// 3. Unknown exam referenced by student
const wb3 = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb3, xlsx.utils.json_to_sheet([{id: 'TS1', date: '2026', start_time: '9', end_time: '10', duration_minutes: 60}]), 'TimeSlots');
xlsx.utils.book_append_sheet(wb3, xlsx.utils.json_to_sheet([{id: 'R1', capacity: 10}]), 'Rooms');
xlsx.utils.book_append_sheet(wb3, xlsx.utils.json_to_sheet([{id: 'F1', name: 'A'}]), 'Faculty');
xlsx.utils.book_append_sheet(wb3, xlsx.utils.json_to_sheet([{id: 'CS101', course_name: 'Intro', duration_minutes: 60}]), 'Exams');
xlsx.utils.book_append_sheet(wb3, xlsx.utils.json_to_sheet([{id: 'S1', batch: '2026', enrolled_exams: 'CS101, FAKE99'}]), 'Students');
xlsx.writeFile(wb3, 'bad_unknown_exam.xlsx');

console.log('Bad workbooks created.');
