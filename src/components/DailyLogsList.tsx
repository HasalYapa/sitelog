import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';
import { Trash2 } from 'lucide-react';
import { useSearch } from '../lib/SearchContext';

interface DailyLog {
  id: string;
  summary: string;
  milestones: string;
  subcontractor: string;
  timestamp: any;
}

export function DailyLogsList() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const q = query(collection(db, 'daily_logs'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData: DailyLog[] = [];
      snapshot.forEach((doc) => {
        logsData.push({ id: doc.id, ...doc.data() } as DailyLog);
      });
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'daily_logs');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'daily_logs', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'daily_logs');
    }
  };

  const filteredLogs = logs.filter(log => {
    const q = searchQuery.toLowerCase();
    return (
      log.summary.toLowerCase().includes(q) ||
      log.milestones.toLowerCase().includes(q) ||
      log.subcontractor.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Loading history...</div>;
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center mt-6">
        <p className="text-slate-500">No daily logs found.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-l-4 border-brand-blue pl-3">History</h3>
      <div className="space-y-4">
        {filteredLogs.map(log => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
                  {log.subcontractor}
                </span>
                <p className="text-sm text-slate-500 mt-2">
                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Saving...'}
                </p>
              </div>
              <button 
                onClick={() => handleDelete(log.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete log"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Summary</h4>
                <p className="text-sm text-slate-600 mt-1">{log.summary}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Milestones</h4>
                <p className="text-sm text-slate-600 mt-1">{log.milestones}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
