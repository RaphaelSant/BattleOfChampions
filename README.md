# Battle of Champions ⚽ 🏆

Bem-vindo à melhor competição de futebol! 🌟

Battle of Champions é um sistema de gerenciamento de competições de futebol de 2 rodadas de pontos corridos, disponível em versões web e mobile, projetado para organizar torneios de maneira simples e eficiente.

## 📱 Interfaces do Sistema

O sistema possui duas interfaces principais:

### 📱 Mobile
![Interface Mobile](/src/components/screenshots/mobile-interface.png)

- Design otimizado para smartphones
- Navegação intuitiva
- Menu hamburguer
- Botões adaptados para touch

### 🖥️ Web
![Interface Web](/src/components/screenshots/web-interface.png)

- Layout responsivo
- Menu superior completo
- Interface moderna
- Visualização em grid

## 🎮 Guia de Utilização do Sistema

### 1. Cadastro de Jogadores 👥
- Acesse a seção "Cadastro de Jogadores"
- Registre todos os participantes do torneio
- Cada jogador terá suas estatísticas iniciadas automaticamente
- O cadastro é necessário para iniciar o torneio

### 2. Sorteio de Confrontos 🎲
- Após cadastrar todos os jogadores, vá para "Sorteio de Confrontos"
- O sistema realizará o sorteio automático dos confrontos
- Os confrontos serão salvos e poderão ser visualizados nesta seção
- Cada jogador terá seus adversários definidos aleatoriamente

### 3. Registro de Resultados ⚽
- Na seção "Inserir Resultados", registre os placares das partidas
- Insira o número de gols de cada jogador
- O sistema atualizará automaticamente:
  - Pontuação dos jogadores
  - Saldo de gols
  - Estatísticas gerais

### 4. Correção de Resultados 📝
- Caso necessite corrigir algum resultado, acesse "Histórico de Partidas"
- Localize a partida que precisa ser corrigida
- Faça a alteração necessária
- O sistema recalculará automaticamente todas as estatísticas

### 5. Acompanhamento da Classificação 🏆
- A seção "Classificação" pode ser consultada a qualquer momento
- Visualize em tempo real:
  - Pontuação atual
  - Número de vitórias
  - Número de derrotas
  - Empates
  - Saldo de gols
  - Gols marcados e sofridos

### 6. Novo Torneio 🔄
- Para iniciar um novo torneio, acesse o menu "Sistema"
- Utilize a opção de Reset para zerar todas as estatísticas
- ⚠️ Atenção: Esta ação não pode ser desfeita
- Após o reset, o sistema estará pronto para um novo torneio

## 🛠️ Tecnologias Utilizadas

- ⚛️ React (Web)
- 📱 React Native (Mobile)
- 🔥 Firebase (Backend)
  - 🔐 Authentication
  - 💾 Firestore

## 📊 Estrutura do Banco de Dados

### 📝 Coleção 'matches'
```javascript
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

### 👥 Coleção 'players'
```javascript
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

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente no arquivo `.env`:
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```
4. Execute o projeto:
```bash
npm start
```

## 💻 Requisitos

### 👨‍💻 Desenvolvimento
- Node.js
- NPM ou Yarn
- Firebase CLI

### 👥 Usuários
- 🌐 Web: Navegador moderno
- 📱 Mobile: Android 5.0+ ou iOS 11+

## ⚠️ Observações Importantes
- ✅ Certifique-se de seguir a ordem das etapas para o correto funcionamento
- 💾 Todos os dados são salvos automaticamente
- 🔄 Mantenha o navegador atualizado para melhor experiência
- ❓ Em caso de dúvidas ou interesses, raphael.sant.emp@gmail.com

## 👨‍💻 Autores

© 2025 Santiago, Inc. 🏢