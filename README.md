# 🚀 Hub de Ocorrências

**Sistema de provas para entregadores — iFood, Uber Eats e 99**

Cansou de ser bloqueado sem provas? O **Hub de Ocorrências** armazena prints, fotos do local e descrições detalhadas de cada problema durante as corridas. Tudo salvo no MongoDB com acesso via navegador do celular.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — Login com sessão de 7 dias
- 📸 **Upload de arquivos** — Prints, fotos, vídeos (até 10 por ocorrência)
- 📋 **Registro completo** — Plataforma, tipo de problema, descrição, data, valor, status
- 🔍 **Filtros** — Busca por plataforma (iFood/Uber/99) e tipo de ocorrência
- 🖼️ **Visualização de fotos** — Galeria direto no navegador
- 👑 **Controle de administradores** — Criação de usuários, permissão de registro
- 🔒 **Registro seletivo** — Admin decide se novos usuários podem se cadastrar
- 📱 **Responsivo** — Funciona perfeitamente no celular
- 🐳 **Docker** — Pronto para deploy em VPS com Portainer

---

## 🧱 Tecnologias

| Stack | Tecnologia |
|-------|-----------|
| Backend | Node.js + Express |
| Frontend | EJS + CSS |
| Banco | MongoDB + GridFS (arquivos) |
| Auth | bcryptjs + sessão |
| Docker | Dockerfile + docker-compose |

---

## 🚀 Deploy no Portainer

### 1. Crie um repositório no GitHub com este código

### 2. No Portainer, vá em **Stacks → Add stack**

| Campo | Valor |
|-------|-------|
| Name | `hub-de-ocorrencias` |
| Repository URL | `https://github.com/seuusuario/hub-de-ocorrencias` |
| Reference | `refs/heads/main` |
| Compose Path | `docker-compose.yml` |

### 3. Adicione as variáveis de ambiente (Advanced mode)

```
MONGO_URI=mongodb://usuario:senha@ip:27017/?authSource=admin
DB_NAME=hub_ocorrencias
SESSION_SECRET=uma_chave_secreta_aqui
PORT=2502
```

### 4. Clique em **Deploy the stack**

### 5. Acesse `http://IP-DA-VPS:2502`

---

## 🔑 Credenciais padrão

| Usuário | Senha | Papel |
|---------|-------|-------|
| `admin` | `admin123` | Administrador |

> ⚠️ Altere a senha do admin no primeiro acesso (Perfil → Alterar Senha)

---

## 🛠️ Uso

### Criar um registro
1. Faça login
2. Clique em **Nova Prova**
3. Preencha: plataforma, tipo de problema, descrição, data
4. Anexe prints ou fotos (até 10 arquivos)
5. Salve

### Gerenciar usuários
1. Acesse **Perfil → Gerenciar usuários**
2. Admin pode: criar, promover, rebaixar ou excluir usuários
3. A chave **"Permitir novos registros"** controla se novos usuários podem ser criados

---

## 📂 Estrutura do projeto

```
├── server.js              # Servidor Express
├── Dockerfile             # Build Docker
├── docker-compose.yml     # Stack Portainer
├── .env                   # Configurações (não versionado)
├── package.json
├── src/
│   ├── config/
│   │   ├── db.js          # Conexão MongoDB + GridFS
│   │   └── seed.js        # Cria admin e configs iniciais
│   ├── middleware/
│   │   └── auth.js        # Middleware de autenticação
│   ├── models/
│   │   ├── User.js        # Modelo de usuário
│   │   ├── Evidence.js    # Modelo de evidência
│   │   └── Settings.js    # Configurações do sistema
│   ├── routes/
│   │   ├── auth.js        # Login/logout
│   │   ├── evidence.js    # CRUD evidências + upload
│   │   └── users.js       # Perfil + gerenciamento
│   └── views/
│       ├── login.ejs
│       ├── dashboard.ejs
│       ├── new.ejs
│       ├── view.ejs
│       ├── profile.ejs
│       └── users.ejs
├── public/
│   └── css/
│       └── style.css
└── README.md
```

---

## 📜 Changelog

### [1.0.0] - 2026-05-28

#### Adicionado
- Sistema de autenticação com login/senha
- Registro de evidências com fotos, prints e descrição
- Upload de arquivos diretamente no MongoDB (GridFS)
- Dashboard com filtros por plataforma (iFood, Uber Eats, 99) e tipo de problema
- Visualização detalhada de cada ocorrência com fotos
- Perfil do usuário com alteração de senha
- Gerenciamento de usuários (criar, promover, rebaixar, excluir)
- Chave de controle: permitir ou bloquear novos registros
- Papéis de usuário: admin e usuário comum
- Deploy via Docker com suporte a Portainer
- Interface web responsiva (funciona no celular)
