const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Generate a random 32-byte (256-bit) secret key for JWT
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Define other environment variables (customize this as needed)
const envVariables = `
JWT_SECRET=${jwtSecret}
`;

const envFilePath = path.join(__dirname, '..', '.env');

// Write the variables to the .env file
fs.writeFileSync(envFilePath, envVariables.trim());

console.log('.env file has been generated successfully!');

