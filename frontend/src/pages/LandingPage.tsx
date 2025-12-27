import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Mochila do Dev
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          Entrar
        </button>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
          Sua carreira dev, <br />
          <span className="text-slate-600">em uma só mochila.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          A plataforma completa para desenvolvedores organizarem seus estudos, 
          exibirem seus projetos e serem encontrados pelos melhores recrutadores.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            Começar agora <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Zap className="text-yellow-400" />}
          title="Foco Absoluto"
          desc="Timer Pomodoro integrado e cronograma semanal de estudos."
        />
        <FeatureCard 
          icon={<Rocket className="text-blue-400" />}
          title="Vitrine de Projetos"
          desc="Exiba seu código de forma profissional para recrutadores."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-400" />}
          title="Conexão Direta"
          desc="Chat exclusivo para recrutadores iniciarem contato com você."
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);