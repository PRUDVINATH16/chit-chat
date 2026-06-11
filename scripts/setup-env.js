const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(process.cwd(), 'server', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists. Skipping automatic setup.');
  process.exit(0);
}

console.log('\n🚀 Starting Automatic ENV Setup for Chit-Chat...\n');

const questions = [
  { key: 'MONGO_URI', label: 'MongoDB URI', placeholder: 'mongodb+srv://...' },
  { key: 'JWT_SECRET', label: 'JWT Secret', placeholder: 'your_super_secret_string' },
  { key: 'CLOUDINARY_CLOUD_NAME', label: 'Cloudinary Cloud Name' },
  { key: 'CLOUDINARY_API_KEY', label: 'Cloudinary API Key' },
  { key: 'CLOUDINARY_API_SECRET', label: 'Cloudinary API Secret' },
  { key: 'ARCJET_KEY', label: 'Arcjet Key' },
  { key: 'MAIL_USER', label: 'Email for Notifications (Nodemailer)' },
  { key: 'MAIL_PASS', label: 'Email App Password' },
];

const answers = {};

const askQuestion = (index) => {
  if (index === questions.length) {
    saveEnv();
    return;
  }

  const q = questions[index];
  const prompt = `${q.label}${q.placeholder ? ` (${q.placeholder})` : ''}: `;
  
  rl.question(prompt, (answer) => {
    answers[q.key] = answer.trim();
    askQuestion(index + 1);
  });
};

const saveEnv = () => {
  let envContent = '';
  for (const [key, value] of Object.entries(answers)) {
    envContent += `${key}=${value}\n`;
  }

  // Adding some defaults
  envContent += `PORT=3000\n`;
  envContent += `CLIENT_URL=http://localhost:5173\n`;
  envContent += `NODE_ENV=development\n`;
  envContent += `REQUEST_LIMIT=30\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ .env file generated successfully at ${envPath}`);
    console.log('You are ready to go! Run "npm start" to begin.\n');
  } catch (err) {
    console.error('\n❌ Error writing .env file:', err);
  } finally {
    rl.close();
  }
};

askQuestion(0);
