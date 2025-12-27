import { Bell } from 'lucide-react';

export const NotificationBell = ({ count }: { count: number }) => {
  return (
    <div className="relative cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all">
      <Bell size={20} className="text-slate-400 hover:text-white" />
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-[#09090b]">
          {count}
        </span>
      )}
    </div>
  );
};