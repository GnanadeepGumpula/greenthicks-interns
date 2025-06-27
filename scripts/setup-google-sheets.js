// Google Sheets Setup Script (using googleapis)
// Run this script to set up your Google Sheets integration
require('dotenv').config({ path: '../.env' });
const { google } = require('googleapis');

async function setupGoogleSheets() {
  try {
    console.log('🚀 Setting up Google Sheets integration...');

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

    console.log('✅ Environment variables found');
    console.log('🔍 GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('🔍 GOOGLE_SHEETS_ID:', process.env.GOOGLE_SHEETS_ID);
    if (process.env.GOOGLE_API_KEY) {
      console.log('🔍 GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY.slice(0, 5) + '...');
    } else {
      console.log('⚠️ GOOGLE_API_KEY not provided (optional)');
    }

    // Validate private key format
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('❌ GOOGLE_PRIVATE_KEY is not in valid PEM format');
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    console.log('✅ GOOGLE_PRIVATE_KEY format validated');

    // Initialize auth
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('✅ Service account authentication initialized');

    // Test authentication
    try {
      await auth.authorize();
      console.log('✅ Authentication with Google API successful');
    } catch (authError) {
      throw new Error(`❌ Failed to authenticate with Google API: ${authError.message}`);
    }

    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet info
    let spreadsheet;
    try {
      spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        fields: 'properties.title,sheets(properties.sheetId,properties.title)',
      });
      console.log(`✅ Connected to Google Sheets: "${spreadsheet.data.properties.title}"`);
      console.log(`📊 Sheet count: ${spreadsheet.data.sheets.length}`);
    } catch (sheetError) {
      throw new Error(`❌ Failed to load spreadsheet info: ${sheetError.message}`);
    }

    // Check for Interns sheet
    let sheet = spreadsheet.data.sheets.find(s => s.properties.title === 'Interns');
    let sheetId;
    if (!sheet) {
      // Create the Interns sheet
      const createResponse = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Interns',
                },
              },
            },
          ],
        },
      });
      sheetId = createResponse.data.replies[0].addSheet.properties.sheetId;
      console.log('✅ Created "Interns" sheet');

      // Set headers in a separate request
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        resource: {
          requests: [
            {
              updateCells: {
                range: {
                  sheetId: sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 15,
                },
                rows: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'ID' } },
                      { userEnteredValue: { stringValue: 'Name' } },
                      { userEnteredValue: { stringValue: 'Email' } },
                      { userEnteredValue: { stringValue: 'Phone' } },
                      { userEnteredValue: { stringValue: 'DateOfBirth' } },
                      { userEnteredValue: { stringValue: 'FatherName' } },
                      { userEnteredValue: { stringValue: 'MotherName' } },
                      { userEnteredValue: { stringValue: 'Photo' } },
                      { userEnteredValue: { stringValue: 'LinkedInProfile' } },
                      { userEnteredValue: { stringValue: 'InternshipFields' } },
                      { userEnteredValue: { stringValue: 'TotalMonthsCompleted' } },
                      { userEnteredValue: { stringValue: 'OnlineMonthsCompleted' } },
                      { userEnteredValue: { stringValue: 'OfflineMonthsCompleted' } },
                      { userEnteredValue: { stringValue: 'CertificateIssueDate' } },
                      { userEnteredValue: { stringValue: 'CreatedAt' } },
                    ],
                  },
                ],
                fields: 'userEnteredValue',
              },
            },
          ],
        },
      });
      console.log('✅ Set headers for "Interns" sheet');
    } else {
      sheetId = sheet.properties.sheetId;
      console.log('✅ "Interns" sheet already exists');
    }

    // Get rows
    let rows;
    try {
      rows = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'Interns!A2:O',
      });
    } catch (error) {
      if (error.code === 404 || error.message.includes('not found')) {
        console.log('📝 No data rows found in "Interns" sheet');
        rows = { data: { values: [] } };
      } else {
        throw error;
      }
    }

    const rowCount = rows.data.values ? rows.data.values.length : 0;
    console.log(`📝 Current rows in sheet: ${rowCount}`);

    if (rowCount === 0) {
      console.log('📝 Sheet is empty - ready for data!');
      console.log('💡 You can now add interns through the admin interface');
    } else {
      console.log('📝 Sheet contains existing data:');
      rows.data.values.slice(0, 3).forEach((row, index) => {
        console.log(`   ${index + 1}. ${row[1] || 'N/A'} (ID: ${row[0] || 'N/A'})`);
      });
      if (rowCount > 3) {
        console.log(`   ... and ${rowCount - 3} more`);
      }
    }

    console.log('\n🎉 Google Sheets setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your application: npm run dev');
    console.log('2. Go to /admin to add interns');
    console.log('3. Use the public site to search and verify certificates');
  } catch (error) {
    console.error('\n❌ Error setting up Google Sheets:');
    console.error(`   Message: ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack}`);
    }
    if (error.response) {
      console.error(`   API Response: ${JSON.stringify(error.response.data, null, 2)}`);
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify GOOGLE_SERVICE_ACCOUNT_EMAIL is shared with the spreadsheet (Editor access).');
    console.log('2. Ensure GOOGLE_PRIVATE_KEY is correctly formatted in .env (with proper newlines).');
    console.log('3. Confirm GOOGLE_SHEETS_ID matches the spreadsheet ID in the Google Sheets URL.');
    console.log('4. Check that the Google Sheets API is enabled in Google Cloud Console.');
    console.log('5. Verify the service account has the "Editor" role in the Google Cloud project IAM settings.');
    console.log('6. Ensure GOOGLE_API_KEY (if used) is unrestricted or allows Google Sheets API.');
    console.log('7. Check for organization policies in Google Cloud that may block API access.');
    console.log('8. Run `npm install googleapis@latest dotenv@latest`.');
    console.log('9. Test with a new spreadsheet shared with the service account.');
    console.log('10. Check Google Cloud Logs for detailed error messages.');
    console.log('11. If sheet creation fails, ensure the spreadsheet is accessible and retry with a new sheet.');
  }
}

setupGoogleSheets();