# Shark Scout - Mini App Server

## Overview

This server integrates with multiple APIs (Neynar for Farcaster data, Alchemy for token balances, Zerion for transactions) to analyze follower networks and their crypto holdings. It's designed to help identify valuable connections within the Farcaster ecosystem based on user scores and wallet activities.

## Architecture

### Core Components

- **Express Server** (`src/index.ts`) - REST API with health check and task processing endpoints
- **Task Processing** (`src/utils/tasks.ts`) - Main business logic for processing user data
- **MongoDB Integration** - Data persistence for balances, histories, and dashboards
- **External API Integrations** - Alchemy, Neynar, and Zerion API clients

### Project Structure

```
src/
├── index.ts                 # Main Express server
├── config/
│   └── mongodb.ts          # Database configuration
├── demo/                   # Demo data and examples
│   ├── alchemy-tokens.ts   # Sample token data
│   ├── neynar-followers.ts # Sample follower data
│   ├── neynar-following.ts # Sample following data
│   ├── neynar-members.ts   # Sample member data
│   └── zerion-transactions.ts # Sample transaction data
├── mongodb/                # Database layer
│   ├── client.ts          # MongoDB connection client
│   ├── models/            # Data models
│   │   ├── balance.ts     # Balance entity
│   │   ├── dashboard.ts   # Dashboard entity
│   │   └── history.ts     # History entity
│   └── services/          # Database services
│       ├── balances.ts    # Balance CRUD operations
│       ├── collections.ts # Collection management
│       ├── dashboards.ts  # Dashboard operations
│       └── histories.ts   # History operations
├── types/                 # TypeScript type definitions
│   ├── alchemy-token.ts   # Alchemy API token types
│   ├── neynar-follow.ts   # Neynar follow relationship types
│   ├── neynar-member.ts   # Neynar member types
│   ├── neynar-user.ts     # Neynar user types
│   ├── trend.ts           # Trend analysis types
│   └── zerion-transaction.ts # Zerion transaction types
└── utils/                 # Utility functions
    ├── alchemy.ts         # Alchemy API client
    ├── balances.ts        # Balance processing utilities
    ├── dashboards.ts      # Dashboard utilities
    ├── histories.ts       # History utilities
    ├── logger.ts          # Winston logging configuration
    ├── neynar.ts          # Neynar API client
    ├── tasks.ts           # Task processing logic
    └── zerion.ts          # Zerion API client
```

## Task Processing Workflow

When a task is started for a specific FID (Farcaster ID):

1. **Load Followers** - Retrieve follower data (currently using demo data)
2. **Filter High-Value Users** - Filter followers by score (≥ 0.9)
3. **Extract Addresses** - Get Ethereum addresses from verified user addresses
4. **Fetch Token Balances** - Use Alchemy API to get token holdings for each address
5. **Store Data** - Save balance data to MongoDB
6. **Calculate Value** - Compute total USD value of all balances

## API Endpoints

### Health Check

- **GET** `/health`
- Returns server health status and timestamp

### Start Task

- **POST** `/api/tasks/start`
- Content-Type: `application/json`
- Body: `{ "fid": number }`
- Starts a task for processing follower data for the given FID

#### Example Request:

```json
{
  "fid": 12345
}
```

#### Example Response:

```json
{
  "success": true,
  "message": "Task started for FID: 12345",
  "timestamp": "2025-08-25T14:58:19.679Z"
}
```

## External Integrations

### Alchemy API

- **Purpose**: Fetch token balances and metadata for Ethereum addresses
- **Network**: Base Mainnet
- **Configuration**: Requires `ALCHEMY_API_KEY` environment variable

### Neynar API

- **Purpose**: Farcaster social graph data (followers, following, user profiles)
- **Status**: Integration planned (currently using demo data)

### Zerion API

- **Purpose**: Transaction history and DeFi activities
- **Status**: Integration planned

## Database Schema

### Collections

- **balances** - Token balance snapshots for addresses
- **dashboards** - User dashboard configurations
- **histories** - Historical data and trends

### Models

- **Balance**: Address, creation date, and array of Alchemy tokens
- **Dashboard**: User-specific dashboard settings
- **History**: Time-series data for trend analysis

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with native driver
- **Logging**: Winston
- **Development**: Nodemon for hot reloading
- **APIs**: Alchemy, Neynar, Zerion

## Environment Variables

Required environment variables:

- `PORT` - Server port (default: 3000)
- `ALCHEMY_API_KEY` - Alchemy API key for token data
- `MONGODB_URI` - MongoDB connection string
- Additional API keys for Neynar and Zerion (when implemented)

## Commands

- Install dependencies - `npm install`
- Run dev mode - `npm run dev`
- Run dev mode with auto-restart - `npm run dev:watch`
- Build project - `npm run build`
- Run compiled code - `npm start`
- Run a specific file - `npx ts-node ./src/filename.ts`

## Testing

Use the `requests.http` file to test the API endpoints with the REST Client extension in VS Code.

## Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

### Watch Mode

The `dev:watch` script uses nodemon to automatically restart the server when you make changes to files in the `src` directory. The configuration is defined in `nodemon.json`:

- Watches: `src` directory
- Extensions: `.ts`, `.js`, `.json`
- Ignores: `dist`, `node_modules`
- Type `rs` in the terminal to manually restart

## Development Workflow

The server is designed for analyzing social connections and their financial activities within the Farcaster ecosystem. It identifies high-value followers based on engagement scores and provides insights into their crypto holdings and transaction patterns.

## Future Enhancements

- Full Neynar API integration for real-time follower data
- Zerion API integration for transaction analysis
- Dashboard functionality for data visualization
- Trend analysis and historical tracking
- Real-time notifications for significant balance changes
