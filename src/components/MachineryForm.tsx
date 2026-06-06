import { addDoc, collection, doc, deleteDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';

export function MachineryForm() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Active' | 'Idle' | 'Maintenance'>('Active');
  const [startTime, setStartTime] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !startTime) return;

    try {
      const machineryRef = collection(db, 'machinery');
      await addDoc(machineryRef, {
        id,
        name,
        status,
        hours: 0,
        startTime,
      });
      setId('');
      setName('');
      setStatus('Active');
      setStartTime('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'machinery');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Equipment ID</label>
        <input required value={id} onChange={(e) => setId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" placeholder="e.g. EX-01" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" placeholder="e.g. Excavator A" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white">
          <option value="Active">Active</option>
          <option value="Idle">Idle</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
        <input required type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white" />
      </div>
      <div className="flex items-center">
        <button type="submit" className="w-full bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
          Add Equipment
        </button>
      </div>
    </form>
  );
}
