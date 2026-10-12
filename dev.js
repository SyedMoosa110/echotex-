import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\x1b[36m%s\x1b[0m', '=============================================================');
console.log('\x1b[36m%s\x1b[0m', '>>> Starting Ecotex Inc. (Frontend + Backend)...');
console.log('\x1b[32m%s\x1b[0m', '    Backend API:  http://localhost:3001');
console.log('\x1b[32m%s\x1b[0m', '    Frontend Web: http://localhost:3000');
console.log('\x1b[36m%s\x1b[0m', '=============================================================');

const isWindows = process.platform === 'win32';
const comSpec = process.env.ComSpec || 'cmd.exe';

// 1. Start Backend API Server
const backend = isWindows
  ? spawn(comSpec, ['/c', 'npm', 'run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
    })
  : spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
    });

// 2. Start Frontend Vite Dev Server
const frontend = isWindows
  ? spawn(comSpec, ['/c', 'npm', 'run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
    })
  : spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
    });

function shutdown() {
  console.log('\n\x1b[33m%s\x1b[0m', '>>> Gracefully stopping all development servers...');
  try {
    if (backend.pid) {
      if (isWindows) {
        spawn('taskkill', ['/pid', backend.pid.toString(), '/T', '/F']);
      } else {
        backend.kill('SIGINT');
      }
    }
    if (frontend.pid) {
      if (isWindows) {
        spawn('taskkill', ['/pid', frontend.pid.toString(), '/T', '/F']);
      } else {
        frontend.kill('SIGINT');
      }
    }
  } catch (err) {
    // Ignore cleanup errors on shutdown
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`Backend exited with code ${code}`);
  }
});

frontend.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`Frontend exited with code ${code}`);
  }
});
