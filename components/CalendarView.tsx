import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SyllabusEvent, EventType } from '../types';

interface CalendarViewProps {
  events: SyllabusEvent[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date | null;
}

const EVENT_COLORS: Record<EventType, string> = {
  [EventType.EXAM]: 'bg-red-500',
  [EventType.QUIZ]: 'bg-orange-500',
  [EventType.ASSIGNMENT]: 'bg-blue-500',
  [EventType.PROJECT]: 'bg-purple-500',
  [EventType.HOLIDAY]: 'bg-green-500',
  [EventType.OTHER]: 'bg-slate-500',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonth)); // 0 = Sunday
  const emptyDays = Array(startDayOfWeek).fill(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="h-24 sm:h-32 bg-slate-50/50 border-b border-r border-slate-100 last:border-r-0" />
        ))}
        
        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`
                min-h-[6rem] sm:min-h-[8rem] p-2 border-b border-r border-slate-100 last:border-r-0 cursor-pointer transition-colors relative
                ${!isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'}
                ${isSelected ? 'bg-primary-50 ring-2 ring-inset ring-primary-500' : 'hover:bg-slate-50'}
              `}
            >
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1
                ${isToday(day) ? 'bg-primary-600 text-white shadow-md' : 'text-slate-700'}
              `}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)] custom-scrollbar">
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    className={`
                      text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate font-medium text-white shadow-sm
                      ${EVENT_COLORS[event.type]}
                    `}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
