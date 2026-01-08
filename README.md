📑 Resumo do Sistema
O LuzDo Dev é uma plataforma de conexão bilateral entre desenvolvedores e recrutadores. O sistema utiliza uma interface de alta fidelidade visual para transformar perfis técnicos em experiências imersivas, facilitando o recrutamento através de dados estruturados e comunicação em tempo real.

🛠️ Arquitetura Tecnológica
Frontend
React + TypeScript (Interface reativa e tipagem estática)

Tailwind CSS (Estilização utilitária de alta performance)

Lucide React (Pacote de ícones minimalistas)

Zustand (Gerenciamento de estado leve e escalável)

Framer Motion (Animações e transições de interface)

Backend & Database
Node.js (Ambiente de execução)

Prisma ORM (Modelagem de dados e queries seguras)

PostgreSQL (Banco de dados relacional robusto)

Socket.io (Comunicação em tempo real para o Chat)

🧬 Modelagem de Dados (Schema)
O sistema opera com três identidades principais definidas via Enums:

DEV: Focado em portfólio, tecnologias e vitrine de projetos.

RECRUITER: Focado em vagas ativas, estatísticas de contratação e cultura da empresa.

CONTENT_CREATOR: Focado em disseminação de conhecimento técnico.

🚀 Funcionalidades Chave
Para Desenvolvedores
Briefing Visual: Bio personalizada com estética terminal.

Tech Stack: Exibição dinâmica de especialidades técnicas.

Project Archive: Galeria de projetos com integração direta ao GitHub e Deploy Live.

Para Recrutadores
Dashboard de Contratação: Métricas de tempo médio de contratação e volume de projetos.

Active Positions: Listagem de vagas com requisitos chave e diferenciais.

Direct Pipeline: Sistema de chat integrado para estabelecer conexões imediatas.

💻 Instalação e Setup
Clonar o Repositório:

Bash

git clone https://github.com/seu-usuario/seu-repositorio.git
Configurar Variáveis de Ambiente: Crie um arquivo .env na raiz do backend e adicione sua URL do banco:

Snippet de código

DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
Instalar Dependências e Migrar Banco:

Bash

npm install
npx prisma migrate dev
Executar em Modo Desenvolvimento:

Bash

npm run dev
🔒 Segurança e Protocolos
Autenticação via JWT.

Proteção de rotas privadas.

Validação de esquemas de dados com Zod/Prisma.
