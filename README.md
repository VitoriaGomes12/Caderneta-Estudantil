# Caderneta-Estudantil
Sistema web para um professor consultar os dados dos estudantes e registar ocorrências.
Um único utilizador (o professor) cadastra e vê tudo.

## Tecnologias

- Backend: Node.js, Express, SQLite (better-sqlite3), JWT
- Frontend: React (Vite), React Router, Axios, Bootstrap

## Requisitos

Node.js 18 ou superior.

## Instalação

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Configuração

Em `backend/`, copia `.env.example` para `.env` e preenche:

```
PORT=3001
JWT_SECRET=uma-frase-longa-e-aleatoria
PROF_USER=professor
PROF_PASS=uma-palavra-passe-forte
```

O utilizador é criado na primeira execução, quando a base de dados está vazia.

## Como correr

Em dois terminais:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Abre http://localhost:5173.

## Dados de exemplo (opcional)

```bash
cd backend && npm run seed
```

## Cópia de segurança

No menu lateral, "Cópia de segurança" descarrega uma cópia da base de dados.
O ficheiro contém dados dos estudantes: guarda-o num local privado.

## Credenciais do projecto
Utilizador : professor
Palavra-Passe : admin123

## Fases do desenvolvimento

- fase-1: login e estudantes
- fase-2: ocorrências
- fase-3: painel, ficha para imprimir, validações, cópia de segurança e novo visual
