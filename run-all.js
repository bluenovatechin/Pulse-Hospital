import { spawn } from 'child_process';
import path from 'path';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('🏥 Starting Pulse Hospital Fullstack System...');

// Start Express Backend
const serverProcess = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true
});

// Start Vite Client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve('./client'),
  stdio: 'inherit',
  shell: true
});

function cleanup() {
  console.log('\nStopping servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
