import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { FileUpload } from './components/FileUpload';
import { CalendarView } from './components/CalendarView';
import { EventList } from './components/EventList';
import { SyllabusEvent, ProcessingStatus, ExtractionResult } from './types';
import { parseSyllabus } from './services/geminiService';
import { generateICS, downloadICS } from './utils/icsUtils';
import { RefreshCw, Calendar as CalendarIcon, Github } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>('IDLE');
  const [data, setData] = useState<ExtractionResult | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // File reader helper
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    setStatus('READING');
    try {
      const base64 = await readFileAsBase64(file);
      setStatus('EXTRACTING');
      
      const result = await parseSyllabus(base64, file.type);
      setData(result);
      setStatus('COMPLETE');
      
      // Select the date of the first event if available
      if (result.events.length > 0) {
        // Sort to find earliest date
        const sorted = [...result.events].sort((a,b) => a.date.localeCompare(b.date));
        setSelectedDate(new Date(sorted[0].date));
      }

    } catch (error) {
      console.error(error);
      setStatus('ERROR');
      alert("Failed to process syllabus. Please try again with a clearer file or check your API Key.");
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (!data) return;
    setData({
      ...data,
      events: data.events.filter(e => e.id !== id)
    });
  };

  const handleExport = () => {
    if (!data || data.events.length === 0) return;
    const icsContent = generateICS(data.events, data.courseName);
    downloadICS(`${data.courseName || 'Syllabus'}.ics`, icsContent);
  };

  const resetApp = () => {
    setData(null);
    setStatus('IDLE');
    setSelectedDate(new Date());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Syllabus Sync</span>
          </div>
          <div className="flex items-center gap-4">
             {status === 'COMPLETE' && (
                <button 
                  onClick={resetApp}
                  className="text-sm text-slate-500 hover:text-primary-600 font-medium flex items-center transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Start Over
                </button>
             )}
          </div>
        </div>
      </header>

      <main className="flex-grow pb-12">
        {status === 'IDLE' || status === 'READING' || status === 'EXTRACTING' ? (
           <>
            <Hero />
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={status === 'READING' || status === 'EXTRACTING'}
            />
            
            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "AI Powered", desc: "Uses Gemini 2.5 Flash to intelligently understand document structure." },
                  { title: "Privacy First", desc: "Files are processed in memory and never stored on our servers." },
                  { title: "Universal Export", desc: "Generates standard .ICS files compatible with Google, Apple, and Outlook." }
                ].map((f, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
           </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
              {/* Left Column: Calendar */}
              <div className="flex-grow lg:w-2/3 h-full overflow-hidden flex flex-col">
                <CalendarView 
                  events={data?.events || []} 
                  onSelectDate={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>

              {/* Right Column: Event List */}
              <div className="lg:w-1/3 h-full">
                <EventList 
                   events={data?.events || []} 
                   courseName={data?.courseName || "Syllabus"}
                   onDeleteEvent={handleDeleteEvent}
                   onExport={handleExport}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Syllabus Sync. Powered by Google Gemini.</p>
        </div>
      </footer>

      {/* Global styles for animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeIn 0.5s ease-out forwards;
        }
        /* Custom scrollbar for webkit */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default App;
