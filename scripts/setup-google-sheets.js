// Google Sheets Setup Script
// Run this script to set up your Google Sheets integration
require('dotenv').config({ path: '../.env.local' });

const { GoogleSpreadsheet } = require("google-spreadsheet")
const { JWT } = require("google-auth-library")

async function setupGoogleSheets() {
  try {
    console.log("🚀 Setting up Google Sheets integration...")

    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error("❌ GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing")
    }

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error("❌ GOOGLE_PRIVATE_KEY environment variable is missing")
    }

    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error("❌ GOOGLE_SHEETS_ID environment variable is missing")
    }

    console.log("✅ Environment variables found")

    // Initialize auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive"
],

    })

    console.log("✅ Service account authentication initialized")

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth)
    await doc.loadInfo()

    console.log(`✅ Connected to Google Sheets: "${doc.title}"`)
    console.log(`📊 Sheet count: ${doc.sheetCount}`)

    // Create or get the Interns sheet
    let sheet = doc.sheetsByTitle["Interns"]
    if (!sheet) {
      sheet = await doc.addSheet({
        title: "Interns",
        headerValues: [
          "ID",
          "Name",
          "Email",
          "Phone",
          "DateOfBirth",
          "FatherName",
          "MotherName",
          "Photo",
          "LinkedInProfile",
          "InternshipFields",
          "TotalMonthsCompleted",
          "OnlineMonthsCompleted",
          "OfflineMonthsCompleted",
          "CertificateIssueDate",
          "CreatedAt",
        ],
      })
      console.log("✅ Created 'Interns' sheet with headers")
    } else {
      console.log("✅ 'Interns' sheet already exists")
    }

    // Check if sheet has data
    const rows = await sheet.getRows()
    console.log(`📝 Current rows in sheet: ${rows.length}`)

    if (rows.length === 0) {
      console.log("📝 Sheet is empty - ready for data!")
      console.log("💡 You can now add interns through the admin interface")
    } else {
      console.log("📝 Sheet contains existing data:")
      rows.slice(0, 3).forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.get("Name")} (ID: ${row.get("ID")})`)
      })
      if (rows.length > 3) {
        console.log(`   ... and ${rows.length - 3} more`)
      }
    }

    console.log("\n🎉 Google Sheets setup completed successfully!")
    console.log("\n📋 Next steps:")
    console.log("1. Start your application: npm run dev")
    console.log("2. Go to /admin to add interns")
    console.log("3. Use the public site to search and verify certificates")
  } catch (error) {
    console.error("\n❌ Error setting up Google Sheets:")
    console.error(error.message)
    console.log("\n🔧 Troubleshooting:")
    console.log("1. Check your environment variables in .env.local")
    console.log("2. Ensure the service account has access to the spreadsheet")
    console.log("3. Verify the spreadsheet ID is correct")
    console.log("4. Make sure the Google Sheets API is enabled")
  }
}

setupGoogleSheets()
