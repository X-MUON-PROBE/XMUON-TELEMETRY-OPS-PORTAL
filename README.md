# 🌌 Portal de Operações e Telemetria XMUON - Deteção de Muões Cósmicos

<div align="center">
  <strong>Uma plataforma web avançada para monitorização e análise de deteção de muões cósmicos em missões atmosféricas</strong>
</div>

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Contexto Científico](#contexto-científico)
- [A Experiência: Detecção de Muões Cósmicos](#a-experiência-detecção-de-muões-cósmicos)
- [O Sistema X-MUON PROBE](#o-sistema-x-muon-probe)
- [A Aplicação Web](#a-aplicação-web)
- [Funcionalidades](#funcionalidades)
- [Arquitetura Técnica](#arquitetura-técnica)
- [Instalação e Execução](#instalação-e-execução)
- [Contribuidores](#contribuidores)

---

## 🎯 Visão Geral

Este projeto implementa um **portal web completo de operações e telemetria** para o sistema **X-MUON PROBE**, um dispositivo inovador de deteção de muões cósmicos concebido para funcionar em missões atmosféricas a bordo de balões meteorológicos elevados até 30 km de altitude (zona da estratosfera).

A plataforma permite:
- **Monitorização em tempo real** de dados de deteção de muões e condições ambientais
- **Análise de missões** com visualização de dados históricos
- **Gestão de projetos** científicos de observação
- **Integração com equipamento** via comunicação LoRa (Long Range)

---

## 🔬 Contexto Científico

### Radiação Cósmica de Alta Energia

A radiação cósmica é produzida em violentos eventos no espaço, como colisões de grandes estruturas cósmicas, que catalizam a libertação de enormes quantidades de radiação de alta e muito alta energia. Esta radiação eventual mente atinge a atmosfera terrestre e se estilhaça em vastos chuveiros de partículas contendo diversos tipos de partículas elementares.

### Os Muões Cósmicos

Entre as diversas partículas presentes nos chuveiros cósmicos, encontram-se:
- Protões
- Piões
- Eletrões
- **Muões** (alvo desta experiência)
- Neutrinos
- E outras partículas elementares

**O Muão** é uma partícula descrita pelo modelo padrão como um leptão, semelhante ao eletrão em termos de carga, mas possuindo uma massa aproximadamente **200 vezes superior** à do eletrão.

#### Propriedades Notáveis:
- ✓ **Elevada penetração**: Atravessa a atmosfera terrestre e superfícies com bastante facilidade
- ✓ **Abundância**: Uma das astropartículas mais comuns ao nível do mar
- ✓ **Detectável**: Pode ionizar tubos de Geiger-Müller, tornando a sua deteção possível
- ✓ **Indicador cosmológico**: Fornece informações valiosas sobre origem e comportamento da radiação cósmica

---

## 🚀 A Experiência: Detecção de Muões Cósmicos

### Objetivo Científico

O projeto, desenvolvido no âmbito do programa **LIP4SCHOOLS**, tem como objetivo:

> **Estudar a presença de muões de origem cósmica em diferentes meios e altitudes, incluindo:**
> - Zonas urbanas e rurais
> - Interior de edifícios
> - Diferentes camadas da atmosfera (até 30 km de altitude)

Esta investigação permite compreender como diferentes altitudes e condições ambientais influenciam a observação e deteção de partículas cósmicas.

### Fases da Experiência

#### Fase 1: Deteção em Superfície

Inicialmente, foi desenvolvido um **protótipo básico de contador de muões** que funciona ao nível do solo, permitindo:
- Contagem de eventos de deteção por minuto (CPM)
- Cálculo de dose de radiação ionizante (μSv/h)
- Monitorização de temperatura e pressão atmosférica
- Indicação visual do nível de radiação via LEDs (verde/amarelo/vermelho)

Este protótipo utiliza:
- **Detector Geiger-Müller** (desenvolvido pelo LIP)
- **Sensor BMP280** (temperatura e pressão)
- **Microcontrolador Raspberry Pi Pico W**
- Programação em **C/C++** via Arduino IDE

#### Fase 2: Missão Atmosférica

Para operações em ambiente atmosférico exigente, foi desenvolvido um **novo conceito de dispositivo** com capacidades expandidas, designado **X-MUON PROBE**.

---

## 🛰️ O Sistema X-MUON PROBE

### Descrição Geral

O X-MUON PROBE é uma sonda científica sofisticada, especificamente desenhada para operações em balões meteorológicos, que integra múltiplos sistemas de medição, controlo e comunicação.

### Componentes Principais

#### 1. **Sistema de Deteção de Muões**
- Detector Geiger-Müller (tubo GM)
- Contagem de eventos de ionização
- Conversão para taxa de dose (μSv/h)

#### 2. **Sistema de Monitorização Ambiental**
- Sensor de temperatura (BMP280)
- Sensor de pressão barométrica (BMP280)
- Monitorização das condições atmosféricas em tempo real

#### 3. **Sistema de Geo-Orientação**
- **Giroscópio/Acelerómetro**: Monitorização de movimento e orientação 3D
- **Magnetómetro (Bússola)**: Determinação da orientação magnética
- Fornece dados de controlo de voo e orientação da sonda

#### 4. **Sistema de Comunicação LoRa**
- **Módulo LoRa** (Long Range): Comunicação de longo alcance com baixo consumo de energia
- **Envio de dados em tempo real** para receptor na superfície
- Transmissão de:
  - Contagem de muões detetados
  - Dados de temperatura e pressão
  - Parâmetros de controlo de voo (orientação, altitude)
  - Temperatura interna do dispositivo
  - Estado de integridade dos sistemas

#### 5. **Sistema de Armazenamento e Transmissão**
- **Receptor LoRa** na superfície terrestre
- **Base de Dados estruturada** para armazenamento de dados
- **Acesso via Ethernet** para análise e integração com aplicações

#### 6. **Microcontrolador**
- **Raspberry Pi Pico W**: Processamento em tempo real, controlo de sensores e comunicação

### Fluxo de Dados

```
[X-MUON PROBE] 
    ↓ (LoRa)
[Receptor Terrestre]
    ↓ (Ethernet)
[Base de Dados]
    ↓
[Portal Web de Telemetria] ← Esta aplicação
```

---

## 💻 A Aplicação Web

### Propósito

O **Portal de Operações e Telemetria XMUON** é uma **plataforma web moderna e responsiva** desenvolvida em **React + Vite**, que oferece:

1. **Interface de Controlo e Monitorização**: Gestão de missões e visualização de dados em tempo real
2. **Análise de Dados**: Ferramentas avançadas para análise de dados históricos de deteção
3. **Visualização Científica**: Gráficos e dashboards para interpretação dos resultados
4. **Gestão de Missões**: Planeamento e acompanhamento de operações
5. **Integração com Equipamento**: Comunicação com o sistema X-MUON PROBE via backend

### Stack Tecnológico

- **Frontend**: 
  - React 19.2.6
  - React Router DOM 7.15.1
  - Vite 8.0.14 (bundler e dev server)
  - Recharts 3.8.1 (visualização de dados)
  - FontAwesome 7.0.0 (ícones)

- **Comunicação**:
  - Microsoft SignalR (comunicação em tempo real)
  - Protocolo LoRa (hardware)

- **Build & Desenvolvimento**:
  - ESLint para qualidade de código
  - Hot Module Replacement (HMR)

### Estrutura do Projeto

```
XMUON-TELEMETRY-OPS-WEB-PORTAL/
├── REACT_VERSION/              # Aplicação React principal
│   ├── src/
│   │   ├── components/         # Componentes React reutilizáveis
│   │   │   ├── HomePage/       # Página inicial
│   │   │   ├── MissionDashboard/  # Dashboard de missão em tempo real
│   │   │   ├── MissionsOverview/  # Visão geral de missões
│   │   │   └── ModalOverlayComp/  # Componentes modais
│   │   ├── businessLogic/      # Lógica de negócio
│   │   ├── assets/             # Recursos estáticos
│   │   ├── App.jsx             # Componente raiz
│   │   └── main.jsx            # Ponto de entrada
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── stylesheets/                # Estilos CSS globais
├── fontawesome-free-7.0.0-web/ # Biblioteca de ícones
└── README.md                   # Este arquivo
```

---

## ✨ Funcionalidades

### 📊 Dashboard em Tempo Real
- Visualização de dados de deteção de muões em tempo real
- Monitorização de temperatura e pressão atmosférica
- Indicadores de saúde do sistema
- Gráficos interativos de dados

### 🎯 Gestão de Missões
- Criação e planeamento de novas missões
- Visualização de histórico de missões
- Análise de dados históricos
- Exportação de relatórios

### 🌍 Monitorização Geoespacial
- Rastreamento de posição e altitude
- Visualização de trajetória de voo
- Dados de orientação e movimento
- Parâmetros ambientais por altitude

### 📈 Análise de Dados Avançada
- Gráficos e estatísticas de deteção
- Análise temporal de dados
- Comparação entre diferentes altitudes
- Identificação de padrões de radiação

### 🔧 Controlo e Configuração
- Parâmetros de configuração do dispositivo
- Limites de alerta e notificações
- Gestão de recursos e alimentação

---

## 🏗️ Arquitetura Técnica

### Fluxo de Dados da Aplicação

```
Utilizador
    ↓
Interface Web (React)
    ↓
API/SignalR Backend
    ↓
Sistema de Armazenamento
    ↓
Processamento e Análise de Dados
```

### Componentes Principais

1. **HomePage**: Página de entrada com informações gerais e navegação
2. **MissionDashboard**: Dashboard em tempo real durante operações
3. **MissionsOverview**: Visão geral e histórico de todas as missões
4. **Componentes Visuais**: Gráficos, indicadores e elementos interativos

### Comunicação em Tempo Real

O sistema utiliza **Microsoft SignalR** para comunicação bidirecional em tempo real entre:
- Frontend (navegador do operador)
- Backend (servidor de aplicação)
- Equipamento (X-MUON PROBE via receptor LoRa)

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 16+ e npm/yarn
- Git
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-repo/XMUON-TELEMETRY-OPS-WEB-PORTAL.git
cd XMUON-TELEMETRY-OPS-WEB-PORTAL
```

2. **Instale as dependências**:
```bash
cd REACT_VERSION
npm install
```

### Execução em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (porta predefinida do Vite)

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `REACT_VERSION/dist/`

### Verificação de Qualidade de Código

```bash
npm run lint
```

---

## 📚 Referências e Recursos

- **Repositório do Código da Sonda**: https://github.com/eduard0sa/ATM_MUON_DETECTION_PROBE
- **Programa LIP4SCHOOLS**: Iniciativa de envolvimento escolar em investigação de partículas
- **Física de Muões**: Modelo Padrão, Física de Altas Energias
- **Deteção de Radiação**: Tubos Geiger-Müller, Espectroscopia de Raios Cósmicos

---

## 🤝 Contribuidores

- **Desenvolvedor Principal**: Eduardo Xavier Oliveira Sá (Colégio Internato dos Carvalhos)
- **Instituição**: Laboratório de Instrumentação e Física Experimental de Partículas (LIP)
- **Data de Desenvolvimento**: Abril de 2025

---

## 📄 Licença

Este projeto está associado ao programa educacional LIP4SCHOOLS e segue os termos de licença especificados pelo LIP e pelas instituições participantes.

---

## 🔗 Links Úteis

- [Documentação Científica](./ATM_MUONIC_PROBE/)
- [Projeto X-MUON PROBE](./ATM_MUONIC_PROBE/MUON-X%20PROBE%20-%20CONCEITO%20&%20IMPLEMENTAÇÃO.md)
- [Contexto Teórico](./ATM_MUONIC_PROBE/DETECÇÃO%20E%20ANÁLISE%20DE%20MUÕES%20COSMICOS%20-%20CONTEXTO%20TEÓRICO.md)

---

<div align="center">
  <!--<strong>🌟 Explorando os Mistérios da Radiação Cósmica 🌟</strong>-->
  <p><em>Sistema concebido no âmbito do projeto 'LIP4SCHOOLS' | 2026</em></p>
</div>