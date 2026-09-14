import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getSampleCollegeData } from './sampleData';

export interface ExportableExam {
  Date: string;
  'Start Time': string;
  'End Time': string;
  Subject: string;
  Room: string;
  Faculty: string;
}

export function fetchAssignmentsFromSession(): any[] {
  try {
    const stored = sessionStorage.getItem('realTimetableResult');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    
    const data = getSampleCollegeData();
    const cExams = Object.fromEntries(data.exams.map(e => [e.id, e]));
    const cTimeSlots = Object.fromEntries(data.time_slots.map(t => [t.id, t]));
    const cRooms = Object.fromEntries(data.rooms.map(r => [r.id, r]));
    
    return Object.entries(parsed.assignments || {}).map(([examId, assignment]: [string, any]) => {
      const exam = cExams[examId];
      const slot = cTimeSlots[assignment.time_slot_id];
      const room = cRooms[assignment.room_id];
      return {
        date: slot ? slot.date : '?',
        startTime: slot ? slot.start_time : '?',
        endTime: slot ? slot.end_time : '?',
        subject: exam ? exam.course_name : examId,
        room: room && room.building ? `${room.building} ${assignment.room_id}` : assignment.room_id,
        faculty: assignment.faculty_ids.join(', ') || '?'
      };
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function formatExamsForExport(exams: any[]): ExportableExam[] {
  return exams.map(exam => ({
    Date: exam.date,
    'Start Time': exam.startTime,
    'End Time': exam.endTime,
    Subject: exam.subject || exam.code,
    Room: exam.room,
    Faculty: exam.faculty
  })).sort((a, b) => {
    // Sort by Date, then Start Time
    if (a.Date !== b.Date) return a.Date.localeCompare(b.Date);
    return a['Start Time'].localeCompare(b['Start Time']);
  });
}

export function exportToCSV(exams: any[], filename = 'Slotwise_Timetable.csv') {
  const data = formatExamsForExport(exams);
  if (data.length === 0) {
    alert("No timetable data to export.");
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Headers
  csvRows.push(headers.map(h => `"${h}"`).join(','));
  
  // Rows
  for (const row of data) {
    const values = headers.map(h => {
      const val = (row as any)[h] ? String((row as any)[h]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(exams: any[], filename = 'Slotwise_Timetable.xlsx') {
  const data = formatExamsForExport(exams);
  if (data.length === 0) {
    alert("No timetable data to export.");
    return;
  }
  
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Timetable");
  
  writeFile(workbook, filename);
}

export function exportToPDF(exams: any[], filename = 'Slotwise_Timetable.pdf', projectName?: string) {
  const data = formatExamsForExport(exams);
  if (data.length === 0) {
    alert("No timetable data to export.");
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(39, 32, 95); // slot-indigo
  doc.text('Slotwise Timetable', 14, 22);
  
  if (projectName) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Project: ${projectName}`, 14, 32);
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => (row as any)[h]));

  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: projectName ? 40 : 35,
    theme: 'grid',
    headStyles: { fillColor: [39, 32, 95] },
    styles: { fontSize: 10, cellPadding: 4 }
  });
  
  doc.save(filename);
}

export function printTimetable() {
  window.print();
}
