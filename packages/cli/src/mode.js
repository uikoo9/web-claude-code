const inquirer = require('inquirer');
const https = require('https');
const { logger } = require('./logger');

async function selectMode() {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Select startup mode:',
      choices: [
        {
          name: 'Local  — Run privately on this machine',
          value: 'local',
        },
        {
          name: 'Online — Share your session publicly via webcc.dev',
          value: 'online',
        },
      ],
    },
  ]);

  return mode;
}

async function verifyToken(token) {
  return new Promise((resolve) => {
    const body = new URLSearchParams({ token }).toString();
    const options = {
      hostname: 'api.webcc.dev',
      path: '/ac/check',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.type === 'success');
        } catch {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.write(body);
    req.end();
  });
}

async function promptOnlineToken() {
  console.log('');
  logger.info('To get your access token, visit: https://www.webcc.dev/');
  console.log('');

  const { token } = await inquirer.prompt([
    {
      type: 'input',
      name: 'token',
      message: 'Enter your access token:',
      validate: (input) => {
        if (!input.trim()) return 'Token is required';
        return true;
      },
    },
  ]);

  console.log('');
  logger.info('Verifying token...');

  const valid = await verifyToken(token.trim());

  if (!valid) {
    logger.error('Token verification failed. Please check your token and try again.');
    logger.error('Get a token at: https://www.webcc.dev/');
    process.exit(1);
  }

  logger.success('Token verified.');
  return token.trim();
}

module.exports = { selectMode, promptOnlineToken };
