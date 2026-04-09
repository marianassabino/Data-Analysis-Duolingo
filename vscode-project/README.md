# 📊 Learning Traces Dashboard

Dashboard interativo para visualizar os dados do `learning_traces.13m.csv` (12.8M registros de aprendizado de idiomas).

---

## Como rodar no VS Code

### Pré-requisitos

Você precisa ter o **Node.js** instalado (versão 16 ou superior).

👉 Baixe em: https://nodejs.org (recomendo a versão LTS)

Para verificar se já tem, abra o terminal e rode:

```bash
node --version
npm --version
```

---

### Passo a passo

**1. Extraia a pasta do projeto** para onde preferir (ex: `Documentos/learning-traces-dashboard`)

**2. Abra a pasta no VS Code**
- Abra o VS Code
- Vá em `Arquivo > Abrir Pasta` e selecione a pasta do projeto

**3. Abra o terminal integrado**
- Use o atalho `Ctrl + `` ` (crase) ou vá em `Terminal > Novo Terminal`

**4. Instale as dependências**

```bash
npm install
```

> Isso vai baixar React, Recharts e tudo que o projeto precisa. Pode levar 1-2 minutos.

**5. Rode o projeto**

```bash
npm start
```

**6. Pronto!** O navegador vai abrir automaticamente em `http://localhost:3000` com o dashboard.

---

## Estrutura do projeto

```
learning-traces-dashboard/
├── public/
│   └── index.html          ← HTML base
├── src/
│   ├── index.js            ← Ponto de entrada
│   └── Dashboard.jsx       ← Componente principal (todo o dashboard)
├── package.json            ← Dependências e scripts
└── README.md               ← Este arquivo
```

---

## O que o dashboard mostra

- **Visão Geral** — Estatísticas gerais + gráficos de sessões e distribuição de recall
- **Idiomas** — Tabela com sessões, usuários, lexemas e precisão por idioma
- **Pares** — Combinações de idiomas (ex: es → en) com ordenação interativa
- **Palavras** — Top palavras mais praticadas por idioma, com filtro e ordenação
- **Recall** — Distribuição de p_recall dos 12.8M registros

---

## Dúvidas comuns

**"npm install" deu erro?**
- Verifique se o Node.js está instalado: `node --version`
- Tente deletar a pasta `node_modules` e rodar `npm install` de novo

**Quero mudar a porta?**
- Rode: `PORT=3001 npm start`

**Quero fazer build para produção?**
- Rode: `npm run build`
- Os arquivos ficam na pasta `build/`, prontos para deploy
