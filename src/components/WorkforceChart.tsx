import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { WorkforceData } from '../types';

import { Trash2 } from 'lucide-react';

export function WorkforceChart() {
  const [data, setData] = useState<WorkforceData[]>([]);

  useEffect(() => {
    const workforceRef = collection(db, 'workforce');
    const unsubscribe = onSnapshot(workforceRef, (snapshot) => {
      const dbData = snapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      })) as (WorkforceData & { docId: string })[];
      
      setData(dbData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'workforce');
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, 'workforce', docId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `workforce/${docId}`);
    }
  };

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Workforce Summary</h3>
          <p className="text-xs text-slate-500 mt-0.5">Total on-site: <span className="font-bold text-slate-700">{total}</span></p>
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          No workforce data.
        </div>
      ) : (
        <>
          <div className="flex-1 w-full min-h-[140px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }} 
                  width={100}
                />
                <Tooltip
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 max-h-48 overflow-y-auto">
            {data.map(item => (
              <div key={item.docId} className="flex justify-between items-center py-2 px-2 hover:bg-slate-50 rounded-md group">
                <div className="flex items-center">
                   <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                   <span className="text-sm font-medium text-slate-700">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                   <span className="text-sm font-bold text-slate-900">{item.count}</span>
                   <button onClick={() => handleDelete(item.docId as string)} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
