import { Calendar, Save, User as UserIcon, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';

export function DailyProgressForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcontractors, setSubcontractors] = useState([
    { id: 'apex', name: 'Apex Concrete Solutions' },
    { id: 'steel', name: 'Titan Steelworks' },
    { id: 'elec', name: 'BrightWire Electrical' },
  ]);
  const [newSubName, setNewSubName] = useState('');

  const [summary, setSummary] = useState('Continued foundation pouring in Sector B. Rebar installation completed for retaining wall section 3.');
  const [milestones, setMilestones] = useState('Foundation Sector B Complete');
  const [subcontractor, setSubcontractor] = useState('apex');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleAddSubcontractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubName.trim()) {
      setSubcontractors([
        ...subcontractors,
        { id: newSubName.toLowerCase().replace(/\s+/g, '-'), name: newSubName.trim() }
      ]);
      setNewSubName('');
      setIsModalOpen(false);
    }
  };

  const handleSaveLog = async () => {
    if (!summary.trim() || !milestones.trim() || !subcontractor) {
      setSaveMessage('Please fill all fields');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'daily_logs'), {
        summary: summary.trim(),
        milestones: milestones.trim(),
        subcontractor,
        timestamp: serverTimestamp()
      });
      setSummary('');
      setMilestones('');
      setSubcontractor('');
      setSaveMessage('Log saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'daily_logs');
      setSaveMessage('Failed to save log');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-brand-blue pl-3 -ml-6">Daily Progress Log</h2>
            <p className="text-sm text-slate-500 mt-1 pl-[-8px]">Record site activities, issues, and milestones.</p>
          </div>
          <div className="flex items-center space-x-3">
            {saveMessage && <span className="text-sm font-medium text-green-600">{saveMessage}</span>}
            <button 
              onClick={handleSaveLog}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-brand-blue hover:bg-blue-800 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-1">
              Work Summary
            </label>
            <textarea
              id="summary"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm text-slate-800 resize-none transition-shadow"
              placeholder="Describe the main activities performed today..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="milestones" className="block text-sm font-medium text-slate-700 mb-1">
                Key Milestones
              </label>
              <input
                type="text"
                id="milestones"
                value={milestones}
                onChange={(e) => setMilestones(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm text-slate-800 transition-shadow"
                placeholder="e.g. Completed Phase 1 pouring"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="subcontractor" className="block text-sm font-medium text-slate-700">
                  Tag Subcontractor
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs text-brand-blue hover:text-blue-800 font-medium flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add New
                </button>
              </div>
              <div className="relative">
                <select
                  id="subcontractor"
                  value={subcontractor}
                  onChange={(e) => setSubcontractor(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm text-slate-800 appearance-none bg-white transition-shadow"
                >
                  <option value="">Select sub-contractor...</option>
                  {subcontractors.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Add Sub-Contractor</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubcontractor} className="p-6">
              <div className="mb-4">
                <label htmlFor="subName" className="block text-sm font-medium text-slate-700 mb-1">
                  Sub-Contractor Name
                </label>
                <input
                  type="text"
                  id="subName"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none text-sm text-slate-800 transition-shadow"
                  placeholder="e.g. Acme Builders Ltd"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
