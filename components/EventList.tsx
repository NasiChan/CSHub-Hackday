import React from 'react';
import { format, parseISO } from 'date-fns';
import { SyllabusEvent, EventType } from '../types';
import { Download, BookOpen, Trash2, CalendarX } from 'lucide-react';

interface EventListProps {
  events: SyllabusEvent[];
  courseName: string;
  onDeleteEvent: (id: string) => void;
  onExport: () => void;
}

const EventTypeBadge: React.FC<{ type: EventType }> = ({ type }) => {
  const styles: Record<EventType, string> = {
    [EventType.EXAM]: 'bg-red-100 text-red-700',
    [EventType.QUIZ]: 'bg-orange-100 text-orange-700',
    [EventType.ASSIGNMENT]: 'bg-blue-100 text-blue-700',
    [EventType.PROJECT]: 'bg-purple-100 text-purple-700',
    [EventType.HOLIDAY]: 'bg-green-100 text-green-700',
    [EventType.OTHER]: 'bg-slate-100 text-slate-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[type]}`}>
      {type}
    </span>
  );
};

export const EventList: React.FC<EventListProps> = ({ events, courseName, onDeleteEvent, onExport }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (events.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center justify-center h-full text-slate-400">
            <CalendarX className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No events extracted yet.</p>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
        <div>
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            {courseName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{events.length} events found</p>
        </div>
        <button
          onClick={onExport}
          className="flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export .ICS
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
        {sortedEvents.map((event) => (
          <div key={event.id} className="group flex items-start p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-100 transition-all">
            <div className="flex-col flex items-center justify-center bg-white p-2 rounded border border-slate-200 min-w-[3.5rem] mr-3 shadow-sm">
               <span className="text-xs font-bold text-slate-500 uppercase">{format(parseISO(event.date), 'MMM')}</span>
               <span className="text-xl font-bold text-slate-800">{format(parseISO(event.date), 'dd')}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-slate-900 truncate pr-2">{event.title}</h3>
                <button 
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                 <EventTypeBadge type={event.type} />
                 {event.time && <span className="text-xs text-slate-500">{event.time}</span>}
              </div>
              
              {event.description && (
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
