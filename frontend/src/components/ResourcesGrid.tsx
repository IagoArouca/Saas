import { ExternalLink, BookmarkPlus, Folder } from 'lucide-react';

export const ResourcesGrid = () => {
  const resources = [
    { title: 'Documentação NestJS', category: 'Backend', url: 'https://docs.nestjs.com' },
    { title: 'Tailwind Play', category: 'Frontend', url: 'https://play.tailwindcss.com' },
    { title: 'Prisma Ref', category: 'Database', url: 'https://prisma.io/docs' },
  ];

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookmarkPlus className="text-blue-500" /> Minha Mochila de Recursos
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res, index) => (
          <a 
            key={index}
            href={res.url}
            target="_blank"
            className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:bg-slate-900 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{res.category}</span>
              <h3 className="font-semibold mt-1 group-hover:text-blue-400 transition-colors">{res.title}</h3>
            </div>
            <div className="mt-4 flex justify-end">
              <ExternalLink size={14} className="text-slate-600 group-hover:text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};