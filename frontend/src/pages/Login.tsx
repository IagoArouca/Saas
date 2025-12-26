export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">Bem-vindo</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Organize sua jornada dev em um só lugar.</p>
        
        <form className="space-y-5">
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none transition-all"
          />
          <input 
            type="password" 
            placeholder="Sua senha" 
            className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none transition-all"
          />
          <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
            Entrar na Mochila
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta? <span className="text-blue-400 cursor-pointer">Cadastre-se</span>
        </p>
      </div>
    </div>
  );
};