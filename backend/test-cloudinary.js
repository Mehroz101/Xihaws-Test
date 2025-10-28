// Simple test script to verify Cloudinary configuration
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing Cloudinary configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Test connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful:', result);
  })
  .catch(error => {
    console.log('❌ Cloudinary connection failed:', error.message);
    console.log('Please check your Cloudinary credentials in the .env file');
  });
