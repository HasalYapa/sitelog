import { Camera, Plus, Loader2, Trash2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorUtils';

interface Photo {
  id: string;
  url: string;
  time: string;
  timestamp: any;
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'photos'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photosData: Photo[] = [];
      snapshot.forEach((doc) => {
        photosData.push({ id: doc.id, ...doc.data() } as Photo);
      });
      setPhotos(photosData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'photos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'photos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'photos');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to stay under 1MB
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

          const now = new Date();
          const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          await addDoc(collection(db, 'photos'), {
            url: dataUrl,
            time: timeString,
            timestamp: serverTimestamp()
          });

          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'photos');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center">
          <Camera className="w-4 h-4 mr-2 text-slate-400" />
          Recent Media
        </h3>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center text-xs font-medium text-white bg-brand-blue hover:bg-blue-800 px-3 py-1.5 rounded-md transition-colors disabled:bg-slate-400"
          >
            {isUploading ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Plus className="w-3 h-3 mr-1.5" />}
            {isUploading ? 'Uploading...' : 'Add Photo'}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
          </div>
        ) : photos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
            <Camera className="w-10 h-10 mb-3 text-slate-200" />
            <p className="text-sm font-medium">No photos yet</p>
            <p className="text-xs mt-1">Upload a photo to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-md overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                <img 
                  src={photo.url} 
                  alt={`Site at ${photo.time}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <button
                  onClick={(e) => handleDeletePhoto(photo.id, e)}
                  className="absolute top-1 right-1 p-1 bg-white/70 hover:bg-red-50 hover:text-red-600 rounded-full text-slate-700 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
                  title="Delete photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end pointer-events-none">
                  <span className="text-[9px] font-medium text-white px-1 py-0.5 m-1 rounded bg-black/40 w-full text-center truncate pointer-events-auto">
                    {photo.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

