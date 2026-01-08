import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Zap, ChevronRight, Terminal, Globe } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const itemAnim: Variants = {
  hidden: { opacity: 0, y: 15 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#020203] text-white font-sans scroll-smooth">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
      </div>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 px-8 py-4 rounded-3xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center">
              <Terminal size={18} className="text-black" />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase italic text-white">LuzNo_Codigo</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/login')} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer">Login</button>
            <button 
              onClick={() => navigate('/register')}
              className="cursor-pointer bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
            >
              Criar conta
            </button>
          </div>
        </div>
      </nav>

      <section className="h-screen snap-start flex flex-col items-center justify-center p-8 relative overflow-hidden group">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }} 
          className="relative z-10 text-center"
        >
          <motion.div variants={itemAnim} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">v1.0 Now_Available</span>
          </motion.div>
          
          <motion.h1 variants={itemAnim} className="cursor-default text-7xl md:text-[10rem] font-black tracking-[-0.05em] leading-[0.8] uppercase italic mb-8 transition-all duration-700 group-hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.5)] group-hover:brightness-125">
            Luz<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 transition-all duration-700 group-hover:from-white group-hover:to-white group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]">
              NO CODIGO
            </span>
          </motion.h1>
          
          <motion.p variants={itemAnim} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            A infraestrutura definitiva para o desenvolvedor moderno. Organize sua stack, 
            estude com precisão e monetize seu talento.
          </motion.p>
          
          <motion.div variants={itemAnim} className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="group/btn bg-blue-600 hover:bg-blue-500 px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-4 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Começar <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>
      <FeatureSection 
        tag="Module_01"
        icon={<Zap size={32} className="text-blue-500" />}
        title="Trabalho Profundo & Precisão"
        desc="Módulos de produtividade projetados para o estado de fluxo. Timer Pomodoro cirúrgico e monitoramento de progresso em tempo real."
        accentColor="blue"
      />
      <FeatureSection 
        tag="Module_02"
        icon={<Rocket size={32} className="text-emerald-500" />}
        title="O Dossiê do Dev"
        desc="Não é apenas um portfólio, é uma ferramenta de recrutamento. Exiba seus projetos com estética cyberpunk e deixe seu código falar por você."
        accentColor="emerald"
        reverse
      />
      <FeatureSection 
        tag="Module_03"
        icon={<Globe size={32} className="text-purple-500" />}
        title="Conexão Global"
        desc="Conecte-se diretamente com recrutadores através de um canal de mensagens. O fim do e-mail frio, o início de oportunidades reais."
        accentColor="purple"
      />
      <section className="h-screen snap-start flex flex-col items-center justify-center p-8 border-t border-white/5 relative">
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full" />
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            transition={{ staggerChildren: 0.2 }}
            className="text-center"
          >
            <motion.h2 variants={itemAnim} className="text-6xl md:text-8xl font-black italic uppercase mb-8 tracking-tighter text-center">
              Preparado?
            </motion.h2>
            <motion.button 
              variants={itemAnim}
              onClick={() => navigate('/register')}
              className="relative bg-white text-black px-16 py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:scale-110 transition-all duration-500 shadow-2xl"
            >
              Criar conta
            </motion.button>
          </motion.div>
        <footer className="absolute bottom-10 text-zinc-600 font-mono text-[10px] uppercase tracking-[0.5em]">
          © 2026 Luz_No_Codigo // TODOS OS DIREITOS RESERVADOS
        </footer>
      </section>
    </div>
  );
};

const FeatureSection = ({ tag, icon, title, desc, accentColor, reverse }: any) => {
  const colors: any = {
    blue: "from-blue-500/10 border-blue-500/20 text-blue-500",
    emerald: "from-emerald-500/10 border-emerald-500/20 text-emerald-500",
    purple: "from-purple-500/10 border-purple-500/20 text-purple-500"
  };

  return (
    <section className="h-screen snap-start flex items-center justify-center p-8 md:p-24 relative overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }} // Cascata mais lenta entre itens
        className={`max-w-7xl w-full flex flex-col lg:flex-row items-center gap-20 ${reverse ? 'lg:flex-row-reverse' : ''}`}
      >
        <div className="flex-1 space-y-8">
          <motion.div variants={itemAnim} className="flex items-center gap-4">
            <div className={`w-12 h-px bg-current ${colors[accentColor]}`} />
            <span className={`font-mono text-[10px] uppercase tracking-[0.5em] ${colors[accentColor]}`}>{tag}</span>
          </motion.div>
          <motion.h2 variants={itemAnim} className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9]">
            {title}
          </motion.h2>
          <motion.p variants={itemAnim} className="text-zinc-400 text-xl font-light leading-relaxed max-w-lg">
            {desc}
          </motion.p>
        </div>

        <motion.div variants={itemAnim} className="flex-1 w-full aspect-square md:aspect-video relative group">
          <div className={`absolute inset-0 bg-gradient-to-tr ${colors[accentColor]} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
          <div className="relative h-full w-full bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-1 shadow-2xl overflow-hidden backdrop-blur-3xl">
            <div className="h-full flex items-center justify-center pt-8">
               {icon}
               <span className="ml-4 font-mono text-[10px] text-zinc-600 tracking-widest uppercase">Pré-visualização do sistema</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};