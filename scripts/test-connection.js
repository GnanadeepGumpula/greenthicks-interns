// scripts/test-googleapis-connection.js
require('dotenv').config({ path: '../.env' });
const { google } = require('googleapis');

async function testGoogleSheetsConnection() {
  try {
    console.log('🔍 Testing Google Sheets connection...');

    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('❌ GOOGLE_PRIVATE_KEY environment variable is missing');
    }
    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error('❌ GOOGLE_SHEETS_ID environment variable is missing');
    }

    console.log('✅ GOOGLE_SERVICE_ACCOUNT_EMAIL: Found');
    console.log('✅ GOOGLE_PRIVATE_KEY: Found');
    console.log('✅ GOOGLE_SHEETS_ID: Found');

    // Initialize auth
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test spreadsheet access
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      fields: 'properties.title',
    });

    console.log(`✅ Success: Connected to "${response.data.properties.title}"`);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
  }
}

testGoogleSheetsConnection();