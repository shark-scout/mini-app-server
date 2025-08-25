# SharkScout - Mini App Server

An Express.js server that provides APIs for task processing.

## Commands

- Install dependencies - `npm install`
- Run dev mode - `npm run dev`
- Run dev mode with auto-restart - `npm run dev:watch`
- Build project - `npm run build`
- Run compiled code - `npm start`
- Run a specific file - `npx ts-node ./src/filename.ts`

## API Endpoints

### Health Check

- **GET** `/health`
- Returns server health status

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
