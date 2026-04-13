# TelkomX Troubleshooter

TelkomX Troubleshooter is a mobile and web support experience prototype built with Expo and React Native. The application is designed to improve how customers, support agents, and technicians manage network issues, service updates, and troubleshooting workflows on the Telkom platform.

## Hackathon Background

This project was developed as a hackathon prototype for the **Telkom 10x Hackathon – Geekulcha & Telkom (09/2025)**.

- **Achieved 2nd Place**, developing a mobile and web application designed to enhance customer experience and improve service usability on the Telkom platform

## Core Capabilities

- Role-based access flows for **Customer**, **Agent**, and **Technician** experiences
- Customer-facing dashboard with ticket progress, outage visibility, and quick actions
- Community forum and chatbot entry points for faster self-service support
- Agent and technician workspace routes for queue, ticket, and notification workflows
- Cross-platform support through Expo for mobile and web environments

## Tech Stack

- **Framework**: Expo + React Native
- **Routing**: Expo Router
- **Language**: TypeScript
- **UI/Styling**: Native components, Expo UI packages, NativeWind/Tailwind utilities
- **Storage**: AsyncStorage (prototype-level local persistence)

## Project Structure

- `app/` - Main application routes and screens
- `app/(auth)/` - Authentication screens
- `app/(tabs)/` - Customer tab navigation screens
- `app/agent/` - Agent-specific views
- `app/technician/` - Technician-specific views

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo-compatible environment (Expo Go app, emulator, or browser for web)

### Installation

```bash
npm install
```

### Run the App

```bash
npm run start
```

You can also run platform-specific commands:

```bash
npm run android
npm run ios
npm run web
```

## Development Notes

- Lint the project:

```bash
npm run lint
```

- Reset starter scaffolding (if needed):

```bash
npm run reset-project
```

## License

This repository currently does not include a dedicated license file. Add a `LICENSE` file if you plan to distribute or open-source the project publicly.
