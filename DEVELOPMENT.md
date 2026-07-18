# Desenvolvimento - Family Dashboard

## Setup Inicial

```bash
npm install
npm install husky --save-dev
npx husky init
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila e faz build para produção
- `npm run lint` - Executa linting do código
- `npm run verify` - Verifica se tudo está pronto para deploy (lint + tsc + build)
- `npm run server` - Inicia o servidor backend

## Verificações Automáticas

O projeto utiliza **Husky** para Git Hooks que rodam automaticamente:

### Pre-commit Hook

Antes de fazer commit, o hook executa:

```bash
npm run lint && npm run build
```

Isso garante que nenhum código com erros seja commitado.

## Antes de fazer Push

Execute localmente:

```bash
npm run verify
```

Isso simula exatamente o que o Vercel vai fazer durante o build, prevenindo erros em produção.

## Troubleshooting

### Husky não está funcionando

Se os hooks não rodarem automaticamente:

```bash
npm install husky --save-dev
npx husky install
```

### Build falhando localmente mas funcionando no Vercel

Execute `npm run verify` para ter certeza que tudo está correto.

### Erro no pre-commit hook

Se receber erro durante commit, corrija o código e tente novamente.

## Regras de Code Style

- ESLint: Configurado em `eslint.config.js`
- TypeScript: Strict mode habilitado
- Sem variáveis não utilizadas
- Sem tipos `any` - use tipos específicos
