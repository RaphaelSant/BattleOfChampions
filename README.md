# Sistema de Gerenciamento de Torneios

## 📋 Sobre o Sistema
Este é um sistema web desenvolvido para gerenciar torneios e competições, oferecendo funcionalidades para controle de jogadores, partidas e resultados. O sistema utiliza Firebase como backend para autenticação e armazenamento de dados.

# Battle of Champions

## 📱 Interfaces do Sistema

### Versão Mobile
![Interface Mobile](/src/components/screenshots/mobile-interface.png)

A versão mobile apresenta:
- Menu hamburguer para navegação
- Layout vertical otimizado para smartphones
- Cards grandes com imagens ilustrativas
- Botões em verde para ações principais
- Navegação simplificada na parte inferior
- Organização clara das funcionalidades:
  - Cadastro de Jogadores
  - Sorteio de Confrontos
  - Inserir Resultados
  - Histórico de Partidas
  - Classificação

### Versão Web
![Interface Web](/src/components/screenshots/web-interface.png)

A versão desktop oferece:
- Menu superior com todas as funcionalidades
- Layout em grid com cards informativos
- Logo centralizada
- Design moderno e clean
- Mesmas funcionalidades organizadas em formato desktop:
  - Cadastro de Jogadores
  - Sorteio de Confrontos
  - Inserir Resultados
  - Histórico de Partidas
  - Classificação

## 🚀 Funcionalidades Principais

### Gestão de Acesso
- Sistema de login utilizando Firebase Authentication
- Rotas protegidas para garantir a segurança das operações

### Módulos do Sistema
1. **Cadastro de Jogadores**
   - Interface para registro e gestão de participantes
   - Armazenamento de estatísticas individuais

2. **Sorteio de Confrontos**
   - Ferramenta para organização automática das partidas

3. **Gestão de Resultados**
   - Interface para inserção dos resultados das partidas
   - Acompanhamento do histórico de partidas realizadas

4. **Classificação**
   - Visualização da classificação geral dos participantes
   - Estatísticas detalhadas de desempenho

## 🛠️ Tecnologias Utilizadas
- React
- React Router DOM para gerenciamento de rotas
- Firebase
  - Authentication para autenticação
  - Firestore para banco de dados
- Variáveis de ambiente (.env)

## 📊 Estrutura do Banco de Dados

### Coleção 'matches'
```
{
    idPlayer1: string,
    idPlayer2: string,
    player1: string,
    player1Goals: number,
    player2: string,
    player2Goals: number,
    result: string,
    round: number,
    turno: number
}
```

### Coleção 'players'
```
{
    draws: number,
    goalDifference: number,
    goalsAgainst: number,
    goalsFor: number,
    losses: number,
    name: string,
    points: number,
    wins: number
}
```

## 🔐 Configuração do Ambiente

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
REACT_APP_FIREBASE_API_KEY=sua_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=seu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
```

## 📌 Estrutura de Páginas
- `/` - Página de Login (acesso público)
- `/Home` - Página inicial (acesso restrito)
- `/CadastroJogadores` - Gestão de jogadores
- `/SorteioConfrontos` - Organização de partidas
- `/InserirResultados` - Registro de resultados
- `/HistoricoPartidas` - Histórico de jogos
- `/Classificacao` - Tabela de classificação

## 💻 Requisitos do Sistema
Para executar o sistema, é necessário ter instalado:
- Node.js
- NPM ou Yarn
- React
- React Router DOM
- Firebase

## 🚀 Como Executar
1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure o arquivo `.env` com suas credenciais do Firebase
4. Execute o projeto com `npm start`

## ⚠️ Observações
- Mantenha o arquivo `.env` seguro e nunca o compartilhe publicamente
- Certifique-se de configurar as regras de segurança adequadas no Firebase