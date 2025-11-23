import { SyllabusEvent } from "../types";

export const generateICS = (events: SyllabusEvent[], calendarName: string = "Syllabus Calendar") => {
  let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SyllabusSync//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${calendarName}\n`;

  events.forEach((event) => {
    // Basic date parsing (Assumes YYYY-MM-DD)
    const dateStr = event.date.replace(/-/g, '');
    const startDate = dateStr;
    // All day event by default if no time, +1 day for end date logic in ICS for all-day
    // For simplicity in this demo, we treat everything as all-day unless we parsed a time, 
    // but simplifying to all-day makes ICS generation much more robust for syllabuses.
    
    icsContent += `BEGIN:VEVENT\n`;
    icsContent += `UID:${event.id}@syllabussync.app\n`;
    icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
    icsContent += `DTSTART;VALUE=DATE:${startDate}\n`;
    icsContent += `SUMMARY:${event.title}\n`;
    if (event.description) {
      icsContent += `DESCRIPTION:${event.description}\n`;
    }
    icsContent += `CATEGORIES:${event.type}\n`;
    icsContent += `END:VEVENT\n`;
  });

  icsContent += `END:VCALENDAR`;

  return icsContent;
};

export const downloadICS = (filename: string, content: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/calendar" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
