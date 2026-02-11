# 🏠 Green Village Calculator

Calculadora inteligente para importação e transporte de casas pré-fabricadas.

---

## ✨ O que faz

✅ **Câmbio offline** - Sem dependência de APIs externas  
✅ **Múltiplas moedas** - EUR, GBP, BRL, USD, CNY, PLN  
✅ **Margem de segurança** - 5% aplicada automaticamente  
✅ **Rotas personalizadas** - Transporte por país  
✅ **Escalas de preço** - Low Budget, Médio, Luxo  
✅ **Exportação PDF** - Gere relatórios profissionais  
✅ **100% Offline** - Funciona sem internet  

---

## 🚀 Como Usar

### 1. Abrir

Duplo-clique em `index.html` ou arraste para o navegador

### 2. Selecione o país

Clique em um dos botões ("Portugal", "Brasil", "China", etc)

### 3. Insira os dados

- **Preço**: Digite o valor em EUR
- **Escala**: Escolha Low Budget, Médio ou Luxo
- **Origem**: Selecione país de origem (para rotas)

### 4. Veja os resultados

Os preços são calculados automaticamente em:
- Euros (EUR)
- Libras (GBP)
- Reais (BRL)
- Dólares (USD)
- Yuan (CNY)
- Zloty (PLN)

### 5. Exporte (opcional)

Clique em **"Descarregar PDF"** para gerar relatório

---

## 📂 Estrutura

```
index.html      ← Abra isto no navegador
css/
  └─ styles.css
js/
  ├─ app.js     ← Lógica da calculadora
  └─ routes.js  ← Dados de rotas
README.md       ← Este arquivo
```

---

## 💱 Câmbios (Offline)

Taxas hardcoded com **margem de segurança de 5%**:

| Moeda | Taxa |
|-------|------|
| GBP | 0.88 EUR |
| BRL | 6.83 EUR |
| CNY | 8.40 EUR |
| USD | 1.16 EUR |
| PLN | 4.73 EUR |

---

## 🎯 Recursos

### Países Suportados
- Portugal
- Brasil
- China
- Reino Unido
- Estados Unidos
- Polónia

### Escalas de Preço
- **Low Budget**: Casas básicas
- **Médio**: Casas padrão
- **Luxo**: Casas premium

### Informações de Transporte
- Rotas específicas por país
- Custos de transporte personalizados
- Tipos de transporte (RO-RO, Container, etc)

---

## ⚙️ Configurações

Você pode personalizar:
- Marginais de impostos por país
- Rotas de transporte
- Escalas de preço

Tudo está no formulário de configurações no tab "⚙️".

---

## 📊 Exemplos

**Exemplo 1: Casa de 100.000 EUR para Portugal**
1. Selecione "Portugal"
2. Preço: 100000
3. Veja o cálculo em todas as moedas

**Exemplo 2: Casa de 50.000 EUR (Luxo) para Brasil**
1. Selecione "Brasil"
2. Preço: 50000
3. Escala: Luxo
4. Veja com impostos brasileiros aplicados

---

## 🔧 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Nada mais! (Sem Node.js, sem servidor, sem internet)

---

## 📝 Notas

- Totalmente offline - funciona em qualquer lugar
- Sem tracking ou dados coletados
- Câmbios atualizáveis manualmente em `js/app.js`
- Interface responsiva (funciona em mobile também)

---

**Versão:** 1.0.0  
**Status:** ✅ Pronto para Produção  
**Autor:** Green Village  
**Licença:** MIT

---

## 🚀 Como Rodar

### Requisitos
- Node.js 16+ instalado
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

### 2. Rodar o Servidor

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

Você verá:
```
╔════════════════════════════════════════╗
║   Green Village Chatbot Server         ║
║   Rodando em http://localhost:3000     ║
╚════════════════════════════════════════╝
```

### 3. Acessar a Calculadora

Abra no navegador: **http://localhost:3000**

---

## 💬 Como Usar o Chatbot

### Dentro da Aplicação

1. Clique no botão **💬** (canto inferior direito)
2. Faça sua pergunta
3. O assistente responderá em tempo real

### Exemplos de Perguntas

```
"Quanto custa uma casa de 5 mil libras para Portugal?"
"Converter 10.000 USD para EUR"
"Qual é a maior taxa de câmbio do BRL?"
"Informações sobre transporte para a Espanha"
"Qual tier aplica para uma casa de 15.000€?"
```

---

## 🏗️ Arquitetura

```
calculadora/
├── index.html              # Interface da calculadora + estilos
├── server.js               # Servidor Node.js que chama API Claude
├── package.json            # Dependências do Node
├── .env.example            # Modelo de configuração (SEGURO)
├── .env                    # Arquivo local (NUNCA commitar!)
├── .gitignore              # Ignora .env e node_modules
│
├── css/
│   └── styles.css          # Estilos adicionais
│
└── js/
    ├── app.js              # Lógica principal da calculadora
    ├── routes.js           # Dados de rotas de transporte
    └── chatbot.js          # Comunicação frontend-backend
```

### Fluxo de Dados

```
Frontend (browser)
    ↓ (mensagem do usuário)
Servidor Node.js (server.js)
    ↓ (chama API de forma segura)
API Claude

← Resposta volta de forma segura →
```

---

## 🔒 Por Que É Seguro?

✅ **Chave guardada no servidor** - Nunca exposta ao navegador
✅ **Frontend não faz chamadas diretas à API** - Usa proxy seguro
✅ **`.env` ignorado pelo Git** - Arquivo local, não versionado
✅ **Arquivo `.gitignore`** - Protege segredos automaticamente

---

## 🐛 Troubleshooting

### "Erro: CLAUDE_API_KEY não está definida"

**Solução:**
```bash
# Verifique se o arquivo .env existe
ls -la .env

# Se não existir, crie:
cp .env.example .env

# Depois adicione sua chave
```

### "Erro: Cannot POST /api/chat"

**Solução:**
1. Verifique se o servidor está rodando: `npm start`
2. Verifique se está em `http://localhost:3000` (não em outro domínio)
3. Verifique o console do navegador (F12) para erros

### "Erro de conexão ao servidor"

**Solução:**
1. O servidor está rodando? Veja a mensagem ao executar `npm start`
2. Está na porta correta (3000)?
3. Dentro do mesmo computador ou em redes diferentes?

---

## 📦 Deploy

### Opção 1: Vercel (Recomendado)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Adicionar variável de ambiente
vercel env add CLAUDE_API_KEY
# Cole sua chave quando solicitado
```

### Opção 2: Heroku

```bash
# Fazer login
heroku login

# Criar app
heroku create seu-app-name

# Adicionar variável
heroku config:set CLAUDE_API_KEY=sk-proj-...

# Deploy
git push heroku main
```

### Opção 3: Docker

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

---

## 📚 Documentação

- [Claude API Docs](https://anthropic.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [Node.js Docs](https://nodejs.org/docs/)

---

## ✨ Funcionalidades Futuras

- [ ] Salvar histórico de conversas
- [ ] Exportar chat como PDF
- [ ] Múltiplos idiomas
- [ ] Análise de sentimento
- [ ] Integração com banco de dados

---

## 📝 Licença

MIT

---

## 🆘 Suporte

Se tiver problemas:
1. Verifique este README
2. Procure por erros no console (F12)
3. Verifique o arquivo `.env`
4. Reinicie o servidor (`npm start`)

---

**Versão:** 1.0.0  
**Última atualização:** 10 de fevereiro de 2026
