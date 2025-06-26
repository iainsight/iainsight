# PLANO DE EXECUÇÃO - PORTAL IA INSIGHT
## https://iainsight.com.br

### FASE 1: PREPARAÇÃO E ESTRUTURAÇÃO
**Duração estimada: 1-2 dias**

#### 1.1 Criação da Estrutura de Pastas e Arquivos
**Comandos Windows (PowerShell/Prompt):**
```
mkdir ia-insight-site
cd ia-insight-site
mkdir assets
mkdir assets\css
mkdir assets\js
mkdir assets\img
mkdir components
mkdir pages
type nul > index.html
type nul > about.html
type nul > services.html
type nul > portfolio.html
type nul > contact.html
type nul > assets\css\style.css
type nul > assets\js\script.js
type nul > components\header.html
type nul > components\footer.html
type nul > components\loader.html
type nul > components\whatsapp-float.html
type nul > README.md
```

#### 1.2 Estrutura Final de Pastas
```
/ia-insight-site  
│  
├── index.html             → Página inicial  
├── about.html             → Sobre nós  
├── services.html          → Serviços  
├── portfolio.html         → Portfólio  
├── contact.html           → Contato e orçamento  
├── README.md              → Documentação do projeto  
│  
├── /assets                → Recursos do projeto  
│   ├── /css/style.css     → Estilo customizado além do Tailwind  
│   ├── /js/script.js      → Interatividade (menu, loader, dark mode, etc.)  
│   └── /img/              → Imagens, logos, banners  
│  
├── /components            → Componentes HTML reutilizáveis  
│   ├── header.html        → Cabeçalho (menu)  
│   ├── footer.html        → Rodapé  
│   ├── loader.html        → Loader animado (carregamento inicial)  
│   └── whatsapp-float.html → Botão flutuante do WhatsApp  
│  
└── /pages                 → (Opcional) páginas internas organizadas  
```

### FASE 2: DESENVOLVIMENTO DOS COMPONENTES BASE
**Duração estimada: 2-3 dias**

#### 2.1 Componentes Globais
- [ ] **Header (header.html)**
  - Menu responsivo com Alpine.js
  - Navegação principal
  - Logo e branding

- [ ] **Footer (footer.html)**
  - Informações da empresa
  - Redes sociais
  - Direitos reservados

- [ ] **Loader (loader.html)**
  - Animação inicial representando IA
  - Elementos visuais (circuito, cérebro digital, rede de nós)

- [ ] **WhatsApp Float (whatsapp-float.html)**
  - Botão flutuante sempre visível
  - Posicionamento canto inferior direito

#### 2.2 Funcionalidades JavaScript (script.js)
- [ ] Menu mobile responsivo
- [ ] Loader animado
- [ ] Scroll Snapping
- [ ] Dark/Light Mode (manual e automático)
- [ ] Validação de formulários
- [ ] Microanimações com Tailwind e Alpine.js

### FASE 3: DESENVOLVIMENTO DAS PÁGINAS
**Duração estimada: 3-4 dias**

#### 3.1 Página Inicial (index.html)
**Hero Section:**
- Título: "Agentes de IA Sob Medida para Impulsionar Seu Negócio"
- Subtítulo: "Desenvolvemos agentes autônomos personalizados que otimizam processos, aumentam sua produtividade e levam sua empresa ao futuro"
- Botões: "Solicitar Orçamento" | "Fale no WhatsApp"
- Seções: Destaques, Nossos Serviços, Sobre Nós, Depoimentos, Chamada para Contato

#### 3.2 Página Sobre Nós (about.html)
**Conteúdo:**
- Quem Somos
- Visão, Missão e Valores
- Diferenciais da empresa
- Foco em inovação e transformação digital

#### 3.3 Página de Serviços (services.html)
**Tipos de Agentes:**
- Agentes de Atendimento (Chatbots, WhatsApp, SAC)
- Agentes de Processamento de Dados
- Agentes de Gestão
- Agentes de Pesquisa e Análise
- Agentes Sob Medida

#### 3.4 Página de Portfólio (portfolio.html)
**Projetos de Exemplo:**
- AgentBot Vendas (40% aumento em conversão)
- DataAnalyzer Pro (80h economizadas mensalmente)
- AutoAgenda (automatização de agendamentos)

#### 3.5 Página de Contato (contact.html)
**Formulário de Orçamento:**
- Nome, Sobrenome, E-mail, Telefone, Empresa
- Campo "Nos conte o que precisa"
- Integração com WhatsApp API
- FormSubmit/GetForm/Formspree para envio

### FASE 4: DESIGN E ESTILIZAÇÃO
**Duração estimada: 2-3 dias**

#### 4.1 Identidade Visual
**Paleta de Cores:**
- Verde Inovação (primária)
- Branco, Preto e Cinza (secundárias)

**Tipografia:**
- Moderna, limpa e tecnológica

#### 4.2 Efeitos Visuais
- [ ] Glassmorphism em cards e formulários
- [ ] Animações suaves e profissionais
- [ ] Transições em hover e entrada de seções
- [ ] Microanimações em elementos interativos

#### 4.3 Responsividade
- [ ] Mobile-first design
- [ ] Breakpoints adequados
- [ ] Teste em diferentes dispositivos

### FASE 5: SEO E OTIMIZAÇÃO
**Duração estimada: 1 dia**

#### 5.1 SEO Básico
- [ ] Meta tags otimizadas
- [ ] Alt em imagens
- [ ] Heading tags estruturadas
- [ ] URLs amigáveis
- [ ] Sitemap

#### 5.2 Performance
- [ ] Otimização de imagens
- [ ] Minificação de CSS/JS
- [ ] Lazy loading
- [ ] Core Web Vitals

### FASE 6: TESTES E VALIDAÇÃO
**Duração estimada: 1-2 dias**

#### 6.1 Testes Funcionais
- [ ] Navegação entre páginas
- [ ] Formulários funcionais
- [ ] Dark/Light Mode
- [ ] Responsividade
- [ ] Loader e animações

#### 6.2 Testes de Compatibilidade
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile e desktop
- [ ] Diferentes resoluções

### FASE 7: DEPLOY E LANÇAMENTO
**Duração estimada: 1 dia**

#### 7.1 Opções de Deploy
- [ ] Netlify
- [ ] Vercel
- [ ] GitHub Pages
- [ ] Servidor próprio

#### 7.2 Configurações Pós-Deploy
- [ ] Domínio personalizado
- [ ] SSL/HTTPS
- [ ] Analytics
- [ ] Monitoramento

### CRONOGRAMA GERAL
- **Fase 1:** Dias 1-2
- **Fase 2:** Dias 3-5
- **Fase 3:** Dias 6-9
- **Fase 4:** Dias 10-12
- **Fase 5:** Dia 13
- **Fase 6:** Dias 14-15
- **Fase 7:** Dia 16

**Total estimado: 16 dias úteis**

### RECURSOS NECESSÁRIOS
- **Desenvolvedor Front-end:** 1 pessoa
- **Designer UI/UX:** 1 pessoa (opcional)
- **Ferramentas:** VS Code, Git, navegadores
- **Tecnologias:** HTML5, CSS3, JavaScript, Tailwind CSS, Alpine.js

### CRITÉRIOS DE SUCESSO
- [ ] Site responsivo e funcional
- [ ] Todas as páginas implementadas
- [ ] Formulários funcionais
- [ ] SEO otimizado
- [ ] Performance adequada
- [ ] Deploy realizado com sucesso

### RISCOS E MITIGAÇÕES
- **Risco:** Atraso no desenvolvimento
  - **Mitigação:** Cronograma com buffer de 20%

- **Risco:** Problemas de compatibilidade
  - **Mitigação:** Testes contínuos em diferentes navegadores

- **Risco:** Problemas no deploy
  - **Mitigação:** Backup e múltiplas opções de hosting

---
*Plano criado em: 23/06/2025*
*Projeto: Portal IA Insight*
*URL: https://iainsight.com.br* 