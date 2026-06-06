import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';
import { MachineryData } from '../types';
import { Trash2, Save, X } from 'lucide-react';
import { useSearch } from '../lib/SearchContext';

export function MachineryStatus() {
  const [data, setData] = useState<MachineryData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { searchQuery } = useSearch();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // UI updates every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const machineryRef = collection(db, 'machinery');
    const unsubscribe = onSnapshot(machineryRef, (snapshot) => {
      const machineryData = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as (MachineryData & { docId: string })[];
      setData(machineryData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'machinery');
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, 'machinery', docId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `machinery/${docId}`);
    }
  };

  const handleEndTimeChange = async (docId: string, item: MachineryData, value: string) => {
    try {
      // Calculate final hours
      let finalHours = 0;
      if (item.startTime) {
        finalHours = calculateHours(item.startTime, value);
      }
      
      await updateDoc(doc(db, 'machinery', docId), {
        endTime: value,
        hours: finalHours,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `machinery/${docId}`);
    }
  };

  const handleClearEndTime = async (docId: string) => {
    try {
      await updateDoc(doc(db, 'machinery', docId), {
        endTime: null,
        hours: 0,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `machinery/${docId}`);
    }
  };

  // Helper to parse "HH:MM" and calculate hours from today's perspective
  const calculateHours = (start: string, end?: string) => {
    if (!start) return 0;
    
    const [startH, startM] = start.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startH, startM, 0, 0);

    let endDate = new Date(currentTime);
    if (end) {
      const [endH, endM] = end.split(':').map(Number);
      endDate = new Date();
      endDate.setHours(endH, endM, 0, 0);
    } // else endDate is current time

    let diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff += 24; // If it rolls over midnight
    
    return Math.max(0, Number(diff.toFixed(1)));
  };

  const filteredData = data.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q) ||
      (item.status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-800">Machinery Status</h3>
        <span className="text-xs text-slate-500">{filteredData.length} equipment on record</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-semibold">Equipment</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Start Time</th>
              <th className="px-5 py-3 font-semibold text-right">End Time</th>
              <th className="px-5 py-3 font-semibold text-right">Hours</th>
              <th className="px-5 py-3 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 text-sm">
                  {searchQuery ? "No matching machinery found." : "No machinery data found. Add some above."}
                </td>
              </tr>
            )}
            {filteredData.map((item: any) => {
              const liveHours = item.endTime ? item.hours : calculateHours(item.startTime);
              
              return (
                <tr key={item.docId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.id}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Idle' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status === 'Active' && <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-500"></span>}
                      {item.status === 'Idle' && <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-slate-400"></span>}
                      {item.status === 'Maintenance' && <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-brand-orange"></span>}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-700">
                    {item.startTime ?? '-'}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-700">
                    {item.endTime ? (
                      <div className="flex items-center justify-end">
                        <span>{item.endTime}</span>
                        <button onClick={() => handleClearEndTime(item.docId)} className="ml-2 text-slate-400 hover:text-slate-600" title="Clear end time">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <input 
                        type="time" 
                        title="Set end time"
                        onChange={(e) => {
                          if(e.target.value) handleEndTimeChange(item.docId, item, e.target.value);
                        }} 
                        className="border border-slate-200 rounded px-2 py-1 text-xs w-28 outline-none focus:border-brand-blue"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-slate-700">
                    <span className={!item.endTime && item.startTime ? "text-brand-blue font-bold flex items-center justify-end" : ""}>
                      {!item.endTime && item.startTime && <span className="inline-block w-2 h-2 rounded-full bg-brand-blue mr-2 animate-pulse"></span>}
                      {liveHours}h
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-slate-400">
                    <button onClick={() => handleDelete(item.docId)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
