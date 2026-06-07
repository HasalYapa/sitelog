import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Task } from '../lib/ganttScheduler';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (tasks: any[]) => void;
}

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.');
          console.error(results.errors);
          return;
        }
        
        onImport(results.data);
      },
      error: (error: any) => {
        setError(error.message);
      }
    });
  };

  const downloadTemplate = () => {
    const template = 'WBS,Task Name,Duration,Predecessors\n1,Project Start,0,\n1.1,Design Phase,10,1\n1.2,Development,20,1.1';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'schedule_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Import Tasks (CSV)</h2>
            <p className="text-sm text-slate-500 mt-1">Bulk upload your project schedule via CSV.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? 'border-brand-blue bg-blue-50' : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-50 rounded-full text-brand-blue">
                <Upload className="w-8 h-8" />
              </div>
            </div>
            <p className="text-slate-700 font-medium mb-1">
              Drag & drop your CSV file here
            </p>
            <p className="text-slate-500 text-sm mb-4">
              or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Browse Files
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
             <div className="flex items-start justify-between">
               <div className="flex items-start gap-3">
                 <FileSpreadsheet className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-slate-700">Need a template?</p>
                   <p className="text-xs text-slate-500 mt-1">Download our sample CSV file to see the required format (WBS, Task Name, Duration, Predecessors).</p>
                 </div>
               </div>
               <button 
                 onClick={downloadTemplate}
                 className="text-xs font-medium text-brand-blue hover:text-blue-700 transition-colors whitespace-nowrap"
               >
                 Download CSV
               </button>
             </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
