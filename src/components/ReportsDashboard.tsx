import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';
import { FileText, Plus, Loader2, Download, Trash2, FileOutput } from 'lucide-react';
import { useProject } from '../lib/ProjectContext';

interface Report {
  id: string;
  type: string;
  date: string;
  timestamp: any;
}

export function ReportsDashboard() {
  const { projectTitle } = useProject();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('Daily Summary');

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportData: Report[] = [];
      snapshot.forEach((doc) => {
        reportData.push({ id: doc.id, ...doc.data() } as Report);
      });
      setReports(reportData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reports');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(async () => {
      try {
        const now = new Date();
        const dateString = now.toLocaleDateString();
        
        await addDoc(collection(db, 'reports'), {
          type: reportType,
          date: dateString,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'reports');
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };

  const handleDownload = async (report: Report) => {
    try {
      const { generatePDFReport } = await import('../lib/reportGenerator');
      await generatePDFReport(projectTitle, report.type, report.date);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback
      const content = `Project Name: ${projectTitle}\nReport Type: ${report.type}\nDate: ${report.date}\n\nThis is an auto-generated report by SiteLog Pro.`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${report.type.replace(/\s+/g, '_')}_${report.date.replace(/\//g, '-')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'reports');
    }
  };

  return (
    <div className="space-y-6 flex flex-col md:flex-row md:space-y-0 md:space-x-6">
      
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-blue pl-3 -ml-6 mb-4">New Report</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Report Type
              </label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm bg-white"
              >
                <option value="Daily Summary">Daily Summary</option>
                <option value="Weekly Progress">Weekly Progress</option>
                <option value="Machinery Status">Machinery Status</option>
                <option value="Workforce Attendance">Workforce Attendance</option>
              </select>
            </div>
            
            <button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="w-full flex justify-center items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileOutput className="w-4 h-4 mr-2" />}
              {isGenerating ? 'Generating...' : 'Generate Format'}
            </button>
            <p className="text-xs text-slate-500 text-center">
              Reports automatically summarize project data into a downloadable layout.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[400px] md:h-[500px]">
          <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-blue pl-3 -ml-6 mb-4">Recent Reports</h3>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-medium">No reports generated</p>
                <p className="text-xs mt-1">Generate a new report to view it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="flex justify-between items-center border border-slate-100 p-4 rounded-lg hover:border-slate-200 transition-colors bg-slate-50/50 group">
                    <div className="flex items-start">
                      <div className="bg-green-100 text-green-700 p-2 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{report.type}</h4>
                        <p className="text-xs text-slate-500 mt-1">{report.date} - {projectTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownload(report)}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
