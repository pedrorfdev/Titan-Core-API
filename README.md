# API NestJS

API REST construída com NestJS para autenticação e gerenciamento de usuários.

## Configuração do Projeto

```bash
# Instalar dependências
$ npm install
```

## Executando o Projeto

```bash
# Modo desenvolvimento
$ npm run start:dev

# Modo produção
$ npm run start:prod

# Iniciar normalmente
$ npm run start
```

A API estará disponível em `http://localhost:3000` (ou na porta especificada na variável de ambiente `PORT`).

## Fluxo da API

### 1. Registrar um Usuário

Primeiro, você precisa registrar um usuário para obter um token de autenticação. Este token será usado para acessar as rotas protegidas.

**Endpoint:** `POST /auth/register`

**Corpo da Requisição:**
```json
{
  "name": "João Silva",
  "username": "joaosilva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Exemplo usando cURL:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Exemplo usando JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'João Silva',
    username: 'joaosilva',
    email: 'joao@example.com',
    password: 'senha123'
  })
});

const data = await response.json();
const token = data.access_token;
```

### 2. Testar Outras Rotas

Após o registro, você receberá um `access_token`. Use este token no header `Authorization` como Bearer token para acessar as rotas protegidas.

**Rotas protegidas requerem o header Authorization:**
```
Authorization: Bearer <seu_access_token>
```

#### Rotas Disponíveis

##### Rotas de Autenticação

- `POST /auth/register` - Registrar um novo usuário e obter um token de acesso (não requer autenticação)
- `PATCH /auth/reset-password` - Redefinir senha (não requer autenticação)

##### Rotas de Usuários

**Todas as rotas de usuários são protegidas e requerem autenticação.**

**GET /users** - Listar todos os usuários (🔒 **Protegida** - requer autenticação)
```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**GET /users/:id** - Buscar um usuário específico por ID (🔒 **Protegida** - requer autenticação)
```bash
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**POST /users** - Criar um novo usuário (🔒 **Protegida** - requer autenticação)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "name": "Maria Santos",
    "username": "mariasantos",
    "email": "maria@example.com",
    "password": "senha123"
  }'
```

**PUT /users/:id** - Atualizar um usuário (🔒 **Protegida** - requer autenticação)
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "name": "Nome Atualizado",
    "email": "novoemail@example.com"
  }'
```

**DELETE /users/:id** - Deletar um usuário (🔒 **Protegida** - requer autenticação)
```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

#### Exemplo Completo do Fluxo

```bash
# 1. Registrar um usuário e salvar o token
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@example.com",
    "password": "senha123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 2. Usar o token para acessar rotas protegidas
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"

# 3. Criar um novo usuário (rota protegida)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Maria Santos",
    "username": "mariasantos",
    "email": "maria@example.com",
    "password": "senha123"
  }'

# 4. Atualizar um usuário (rota protegida)
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Nome Atualizado"
  }'

# 5. Deletar um usuário (rota protegida)
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Licença

Este projeto está licenciado sob a Licença MIT.
