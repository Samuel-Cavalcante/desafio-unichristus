# Desafio Técnico - Sistema de Agendamento de Salas

Este repositório tem como objetivo prover uma interface para visualização e gerenciamento de alocação de salas e horários.

## 📂 Estrutura do Projeto

O projeto está dividido em dois diretórios principais:

## 🛠️ Tecnologias
* **Back-end (`/api`):** Backend Desenvolvido em Java com Spring Boot.
* **Front-end (`/client`):** Frontend desenvolvido em Nextjs (React). Responsável pela interface de grade de horários e interação com o usuário.

## ✨ Principais Funcionalidades
* **Mapa de Ocupação:** Calendário interativo (mês/semana/dia) usando `react-big-calendar`.
* **Filtros Dinâmicos:** Menu lateral em acordeão que agrupa salas por andar e filtra agendamentos em tempo real.
* **Gestão (CRUD):** Criação, edição, exclusão e visualização de reservas via modais.

## 🚀 Como Executar

### Pré-requisitos
* Java JDK 17+ e uma IDE (Eclipse, IntelliJ, etc.)
* Node.js (v20.17.0)

### 1. Back-end (API - Porta 8080)
1. Abra a pasta `/api` na sua IDE.
2. Atualize as dependências do Maven.
3. Execute a classe principal (ex: `AgendamentoApiApplication.java`).
4. Confirme no console: `Tomcat started on port(s): 8080`.

### 2. Front-end (Interface - Porta 3000)
Abra um terminal, navegue até a pasta do projeto e rode os comandos:

```bash
cd client
npm install
npm run dev