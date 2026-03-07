# Guia de Deploy — Render

> Deploy da API `network_of_schools` (Node.js + TypeScript + Prisma + PostgreSQL) no Render.

---

## O que é o Render?

O **Render** é uma plataforma de cloud (nuvem) que hospeda aplicações web. Ele funciona
de forma parecida com Heroku — você conecta o seu repositório do GitHub, configura
algumas coisas, e o Render cuida de rodar e manter sua aplicação no ar.

No nosso caso, vamos usar dois serviços do Render:
- **PostgreSQL** — banco de dados hospedado na nuvem (substitui o Docker local)
- **Web Service** — onde a nossa API vai rodar (substitui o `npm run dev` local)

---

## Por que precisamos mudar o código?

Localmente, a API roda com `ts-node-dev` e usa o Docker para o banco.
Em produção (Render), isso muda em dois pontos importantes:

### 1. Porta dinâmica

Localmente, a porta está fixa no código:

```typescript
// src/server.ts (como está hoje)
app.listen(4003, () => { ... })
```

O Render **não permite** porta fixa. Ele define a porta que sua aplicação deve
usar através de uma variável de ambiente chamada `PORT`. Se sua app não respeitar
essa variável, o Render não consegue rotear o tráfego para ela e o deploy falha.

**Solução:** Ler a porta da variável de ambiente, com fallback para 4003 localmente:

```typescript
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => { ... })
```

### 2. TypeScript não roda em produção

O `ts-node-dev` é uma ferramenta de **desenvolvimento** — ela converte TypeScript
para JavaScript na hora, o que é lento e pesado para produção.

Em produção, o padrão é:
1. **Compilar** o TypeScript para JavaScript uma única vez (`tsc` → gera a pasta `dist/`)
2. **Rodar** o JavaScript compilado diretamente com Node.js (`node dist/server.js`)

Por isso precisamos adicionar dois scripts no `package.json`:
- `build` — compila o TypeScript
- `start` — executa o JavaScript compilado

### 3. Prisma precisa gerar o client

O Prisma Client é gerado a partir do `schema.prisma`. Esse processo (`prisma generate`)
precisa rodar antes de compilar o TypeScript, para que os tipos do Prisma estejam
disponíveis na compilação.

---

## Alterações no código

### `src/server.ts` — porta dinâmica

**Antes:**
```typescript
app.listen(4003, () => {
    console.log('Server is running on PORT 4003');
})
```

**Depois:**
```typescript
const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
```

**Por que `process.env.PORT || 4003`?**
- `process.env.PORT` — lê a variável de ambiente `PORT` que o Render injeta
- `|| 4003` — se não existir (ambiente local), usa 4003 como padrão

---

### `package.json` — scripts de build e start

**Antes (scripts):**
```json
"scripts": {
  "dev": "ts-node-dev ...",
  "test": "...",
  "type-check": "tsc --noEmit",
  "migrate:dev": "prisma migrate dev"
}
```

**Depois (adicionar `build` e `start`):**
```json
"scripts": {
  "dev": "ts-node-dev ...",
  "build": "prisma generate && tsc",
  "start": "node dist/server.js",
  "test": "...",
  "type-check": "tsc --noEmit",
  "migrate:dev": "prisma migrate dev"
}
```

**Por que `prisma generate && tsc`?**
- `prisma generate` — gera o Prisma Client tipado a partir do `schema.prisma`
- `&&` — só executa o próximo comando se o anterior terminar sem erro
- `tsc` — compila todos os arquivos TypeScript para JavaScript na pasta `dist/`

**Por que `node dist/server.js`?**
- `dist/server.js` é o arquivo compilado pelo `tsc` a partir de `src/server.ts`
- `node` executa JavaScript puro, sem precisar do TypeScript instalado

---

### `.gitignore` — ignorar pasta `dist/`

A pasta `dist/` é gerada automaticamente pelo `tsc`. Não faz sentido versionar
arquivos gerados — o Render vai gerá-los sozinho durante o build.

Adicionar `dist` ao `.gitignore`:
```
node_modules
coverage
.env
dist
```

---

## Passo a passo no Render

### Pré-requisito: código no GitHub

O Render faz deploy a partir de repositórios do GitHub/GitLab. O seu código
precisa estar em um repositório remoto com as alterações acima já commitadas.

---

### Passo 1 — Criar uma conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **Get Started** e crie uma conta (pode usar o login do GitHub)

---

### Passo 2 — Criar o banco de dados PostgreSQL

O Render oferece PostgreSQL gerenciado. Ele substitui o container Docker
(`docker-compose.yml`) que usamos localmente.

1. No dashboard do Render, clique em **New +**
2. Selecione **PostgreSQL**
3. Preencha:
   - **Name:** `network-of-schools-db` (ou qualquer nome)
   - **Region:** escolha a mais próxima (ex: `Oregon (US West)`)
   - **Plan:** `Free` (gratuito, com limitações)
4. Clique em **Create Database**
5. Aguarde o banco subir (leva alguns segundos)
6. **Copie a `Internal Database URL`** — você vai usar no próximo passo

> A `Internal Database URL` é a string de conexão que sua API usará para se
> conectar ao banco. Ela tem o formato:
> `postgresql://usuario:senha@host/nome_do_banco`

---

### Passo 3 — Criar o Web Service

1. No dashboard, clique em **New +**
2. Selecione **Web Service**
3. Conecte sua conta do GitHub (se ainda não conectou)
4. Selecione o repositório `network_of_schools`
5. Preencha as configurações:

| Campo | Valor |
|-------|-------|
| **Name** | `network-of-schools-api` |
| **Region** | Mesma do banco de dados |
| **Branch** | `master` |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm start` |
| **Plan** | `Free` |

> **Por que `npx prisma migrate deploy` no Start Command?**
>
> O comando `migrate deploy` aplica as migrations pendentes no banco de produção.
> Diferente do `migrate dev` (que usamos localmente), o `migrate deploy` é seguro
> para produção — ele não cria migrations novas, só aplica as que já existem
> na pasta `prisma/migrations/`.
>
> Colocamos isso no Start Command (e não no Build Command) porque ele precisa
> do banco de dados disponível, e o banco só está acessível em runtime.

---

### Passo 4 — Configurar variáveis de ambiente

Ainda na tela de criação do Web Service, role até a seção **Environment Variables**
e adicione:

| Chave | Valor |
|-------|-------|
| `DATABASE_URL` | Cole aqui a `Internal Database URL` copiada no Passo 2 |

> **Por que variável de ambiente e não hardcoded?**
>
> - Segurança: credenciais de banco não ficam expostas no código/GitHub
> - Flexibilidade: o mesmo código funciona localmente (com `.env`) e em produção
>   (com a variável do Render)
> - O arquivo `.env` local fica no `.gitignore` justamente por isso

---

### Passo 5 — Iniciar o deploy

1. Clique em **Create Web Service**
2. O Render vai:
   - Clonar o repositório
   - Rodar o **Build Command**: `npm run build`
     - `prisma generate` — gera o Prisma Client
     - `tsc` — compila o TypeScript para JavaScript em `dist/`
   - Rodar o **Start Command**: `npx prisma migrate deploy && npm start`
     - `prisma migrate deploy` — aplica as migrations no banco
     - `npm start` — executa `node dist/server.js`

3. Acompanhe os logs em tempo real na aba **Logs**

---

### Passo 6 — Acessar a API

Após o deploy finalizar com sucesso, o Render disponibiliza uma URL pública no
formato:

```
https://network-of-schools-api.onrender.com
```

Sua API e o Swagger estarão acessíveis em:
- `https://seu-servico.onrender.com/` — API
- `https://seu-servico.onrender.com/api-docs` — Swagger UI

---

## Fluxo completo — resumo visual

```
GitHub (código-fonte)
        |
        | (Render lê o repositório)
        v
   [Build Command]
   npm run build
        |
        |-- prisma generate  →  gera Prisma Client tipado
        |-- tsc              →  compila TS → JS em dist/
        v
   [Start Command]
   npx prisma migrate deploy  →  aplica migrations no banco Render
   npm start                  →  node dist/server.js
        |
        v
   API rodando na nuvem 🚀
   https://seu-servico.onrender.com
```

---

## Redeploy automático

Por padrão, o Render observa o branch configurado (`master`). Toda vez que você
fizer `git push` para esse branch, o Render detecta a mudança e inicia um novo
deploy automaticamente.

---

## Observações importantes sobre o plano Free

O plano gratuito do Render tem algumas limitações:
- O **Web Service** entra em modo *sleep* após 15 minutos de inatividade
- A primeira requisição após o sleep pode demorar ~30 segundos para "acordar"
- O **PostgreSQL gratuito** expira após 90 dias (é necessário recriar)

Para desenvolvimento e estudos, o plano gratuito é mais do que suficiente.

---

## Troubleshooting (erros comuns)

| Erro | Causa | Solução |
|------|-------|---------|
| `Port is already in use` | Porta hardcoded | Usar `process.env.PORT` |
| `Cannot find module 'dist/server.js'` | Build não rodou | Verificar Build Command |
| `Error: P1001 - Can't reach database` | `DATABASE_URL` errada | Conferir a variável de ambiente |
| `Migration failed` | Migrations com conflito | Verificar pasta `prisma/migrations/` |
| TypeScript errors no build | Tipos com erro | Rodar `npm run type-check` localmente |
