## ⚙️ Instalação

1. Realize o clone do repositório:
```
git clone https://github.com/FThiagoB/FSN3-Projeto-Integrador-GameVault.git
cd FSN3-Projeto-Integrador-GameVault
```

2. Instale os módulos:
```
cd client
npm install
cd ../server
npm install
```

3. Configure o arquivo .env com a URL de conexão do banco de dados (PostgreSQL):

Dentro da pasta do servidor crie o arquivo `.env` e configure a URL de conexão com o banco de dados, que segue o modelo:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/fsn3?schema=public"
```

4. Use o comando migrate do Prisma:

Dentro da pasta do servidor use o comando:

```
npx prisma migrate dev --name init
```

5. Popule as tabelas com alguns exemplos:

Ainda dentro da pasta do servidor use o comando:

```
npm run seed
```

6. Rode o servidor

Dentro da pasta `src/` do servidor, executar:

```
node server.js
```