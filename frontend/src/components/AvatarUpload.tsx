import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import api from '../services/api';

export const AvatarUpload = ({ currentAvatar }: { currentAvatar: string }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/profiles/upload-avatar', formData);
      setPreview(res.data.url); 
    } catch (err) {
      alert('Erro ao subir imagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32">
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin" /> : <img src={preview} className="w-full h-full object-cover" />}
      </div>
      
      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
        <Camera className="text-white" />
        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
      </label>
    </div>
  );
};