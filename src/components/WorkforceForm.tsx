import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';

export function WorkforceForm() {
  const [category, setCategory] = useState('');
  const [count, setCount] = useState<number>(0);
  const [color, setColor] = useState('#1e40af'); // default brand-blue

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || count < 0) return;

    try {
      const categoryId = category.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const workforceRef = doc(db, 'workforce', categoryId);
      await setDoc(workforceRef, {
        category,
        count: isNaN(Number(count)) ? 0 : Number(count),
        color,
      });
      setCategory('');
      setCount(0);
      setColor('#1e40af');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'workforce');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
      <div className="sm:col-span-1 md:col-span-2">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category (e.g. Skilled)</label>
        <input required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" placeholder="e.g. Specialists" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Color Code</label>
        <div className="flex items-center space-x-2">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 p-1 border border-slate-300 rounded cursor-pointer" />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Count</label>
        <div className="flex space-x-2">
          <input required type="number" min="0" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue" />
          <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
            Update
          </button>
        </div>
      </div>
    </form>
  );
}
