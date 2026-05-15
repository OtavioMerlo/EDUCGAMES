<div align="center">
  <img src="client/public/logo.png" width="140" alt="EducaGames Logo" />
  <h1>EducaGames PRO 🎮</h1>
  <p><strong>A Revolução da Educação Gamificada e Gestão Escolar</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>

  <p align="center">
    <i>Uma plataforma TCC de alto nível que transforma o aprendizado em uma jornada épica de conquistas, níveis e recompensas reais.</i>
  </p>
</div>

---

## ✨ Visão Geral

**EducaGames** é um ecossistema educacional completo que utiliza mecânicas avançadas de jogos (Gamificação) para engajar alunos. Através de atividades pedagógicas reais, os alunos acumulam XP e Moedas, que podem ser trocados por itens cosméticos ou recompensas tangíveis, criando um ciclo positivo de estudo e recompensa.

---

## 🛠️ O que há de novo na Versão PRO v2.5

### 🎛️ Painel Administrativo de Elite
Um centro de controle total para gestores da plataforma:
- **Dashboard de Analytics:** Gráficos em tempo real de crescimento de usuários e economia.
- **Gestão de Usuários:** Moderação completa, alteração de cargos e suspensões.
- **Controle de Inventário:** Gerencie todos os itens da loja, auras e acessórios.
- **Logs de Auditoria:** Rastreie cada ação importante realizada no sistema.
- **Segurança Avançada:** Proteção de rotas com RBAC (Role Based Access Control).

### 🔍 Busca Inteligente Global
Sistema de pesquisa moderna inspirado no Discord e Spotify:
- **Pesquisa Parcial:** Encontre jogadores e conteúdos digitando apenas partes do nome.
- **Feedback Visual:** Destaque de termos pesquisados e carregamento fluído.
- **Paleta de Comandos:** Acesso rápido (Ctrl+K) para navegação instantânea.

### 🎒 Inventário & Cosméticos de Heróis
- **Avatar Dinâmico:** Suporte a múltiplas camadas (Aura + Acessórios + Skins).
- **Acessórios de Heróis:** Itens icônicos como o traje do Superman (Smallville), capas e efeitos visuais.
- **Z-Index Layering:** Sistema inteligente que garante que acessórios não sobreponham informações críticas.

### 📚 Conteúdo Pedagógico de Qualidade
- **Banco de Atividades Real:** Chega de placeholders! Mais de 30 atividades com perguntas reais de Matemática, Português, História, Biologia, Física, Química e Filosofia.
- **Níveis de Dificuldade:** Recompensas proporcionais ao desafio (Fácil, Médio, Difícil).

### 🏪 Loja Comum & Loja24
- **Vitrine Expandida:** Suporte para centenas de itens simultâneos.
- **Estoque Ilimitado:** Preparado para apresentações em feiras e eventos (Araçatuba/Ilha Solteira).
- **Cerimônia de Abertura:** Animações épicas ao resetar a loja diária.

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia | Destaque |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Performance ultra-rápida |
| **Animações** | Framer Motion | Transições de página e micro-interações |
| **Estilização** | TailwindCSS | Design System consistente |
| **Gestão de Dados** | React Query (TanStack) | Cache inteligente e Sincronização |
| **Backend** | Node.js + Express | API REST robusta |
| **Banco de Dados** | Prisma + SQLite | Facilidade de deploy e migração |
| **Validação** | Zod + Hook Form | Formulários seguros e tipados |

---

## 🏁 Como Executar o Projeto

### 🚀 Início Rápido (Windows)
1. Certifique-se de ter o **Node.js** instalado.
2. Execute o arquivo `start.bat` na raiz do projeto.
3. O script irá instalar dependências, configurar o banco e abrir o navegador automaticamente.

### 🛠️ Instalação Manual
**1. Backend:**
```bash
cd server
npm install
npx prisma db push
node prisma/seed.js  # Conteúdo base
node prisma/quality_activities_seed.js # Atividades reais
npm run dev
```

**2. Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Contas para Testes (Feira)

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin@educagames.com` | `admin123` |
| **Professor** | `professor@educagames.com` | `teacher123` |
| **Estudante** | `aluno@educagames.com` | `student123` |

---

## 📸 Interface e Experiência
A plataforma conta com um design **Frosted Glass** (vidro jateado), animações de partículas e suporte completo a **Modo Escuro e Modo Claro**, garantindo acessibilidade e um visual premium que impressiona logo no primeiro contato.

---

<div align="center">
  <p>Desenvolvido para o Trabalho de Conclusão de Curso (TCC).</p>
  <sub>© 2026 EducaGames — A educação nunca foi tão divertida.</sub>
</div>
