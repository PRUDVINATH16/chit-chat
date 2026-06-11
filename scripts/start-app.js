const { spawn } = require('child_process');
const path = require('path');

const rootDir = process.cwd();

console.log('\n🚀 Starting Chit-Chat in Development Mode...\n');

// Helper to spawn processes
const startProcess = (command, args, cwd, label) => {
  const child = spawn(command, args, { 
    cwd, 
    shell: true,
    stdio: 'inherit' // We inherit stdio to see the logs, but we could pipe them if we wanted custom formatting
  });

  child.on('error', (err) => {
    console.error(`❌ Error starting ${label}:`, err);
  });

  return child;
};

// Start Backend
const backend = startProcess('npm', ['run', 'dev'], path.join(rootDir, 'server'), 'Backend');

// Start Frontend
const frontend = startProcess('npm', ['run', 'dev'], path.join(rootDir, 'client'), 'Frontend');

// Beautiful Dashboard
setTimeout(() => {
  console.log('\n' + '━'.repeat(50));
  console.log('✨  CHIT-CHAT IS LIVE!');
  console.log('━'.repeat(50));
  console.log('🌐  Frontend:  http://localhost:5173');
  console.log('⚙️   Backend:   http://localhost:3000');
  console.log('📖  API Docs:  http://localhost:3000/api');
  console.log('━'.repeat(50));
  console.log('\n💡 Press Ctrl+C to stop both services.\n');
}, 3000); // Wait 3 seconds for initial logs to settle

// Handle termination
const killProcesses = () => {
  console.log('\n🛑 Stopping services...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', killProcesses);
process.on('SIGTERM', killProcesses);
