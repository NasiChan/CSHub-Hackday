import React from 'react';
import { Calendar, UploadCloud, CheckCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Sync Your Syllabus</span>{' '}
        <span className="block text-primary-600 xl:inline">in Seconds</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Upload your course syllabus (PDF or Image). We use AI to extract all your exams, assignments, and deadlines automatically.
      </p>
      <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-6">
        <div className="flex items-center space-x-2 text-slate-600">
           <UploadCloud className="w-5 h-5 text-primary-500" />
           <span>Upload File</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
           <CheckCircle className="w-5 h-5 text-primary-500" />
           <span>Verify Dates</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-600">
           <Calendar className="w-5 h-5 text-primary-500" />
           <span>Export to Calendar</span>
        </div>
      </div>
    </div>
  );
};
