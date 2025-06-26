// Test Google Sheets Connection
// Run this script to test your Google Sheets connection

const { GoogleSpreadsheet } = require("google-spreadsheet")
const { JWT } = require("google-auth-library")

async function testConnection() {
  try {
    console.log("🔍 Testing Google Sheets connection...")

    // Check environment variables
    const requiredVars = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEETS_ID"]

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`❌ Missing environment variable: ${varName}`)
      }
      console.log(`✅ ${varName}: Found`)
    }

    // Initialize auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Test connection
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth)
    await doc.loadInfo()

    console.log("\n📊 Connection successful!")
    console.log(`📋 Spreadsheet: "${doc.title}"`)
    console.log(`📄 Sheets: ${doc.sheetCount}`)
    console.log(`🔗 URL: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}`)

    // Check for Interns sheet
    const internsSheet = doc.sheetsByTitle["Interns"]
    if (internsSheet) {
      const rows = await internsSheet.getRows()
      console.log(`✅ Interns sheet found with ${rows.length} rows`)
    } else {
      console.log("⚠️  Interns sheet not found - run setup script first")
    }

    console.log("\n🎉 All tests passed! Your Google Sheets integration is ready.")
  } catch (error) {
    console.error("\n❌ Connection test failed:")
    console.error(error.message)

    if (error.message.includes("ENOTFOUND")) {
      console.log("\n🌐 Network issue - check your internet connection")
    } else if (error.message.includes("403")) {
      console.log("\n🔐 Permission issue - check service account access")
    } else if (error.message.includes("404")) {
      console.log("\n📋 Spreadsheet not found - check your GOOGLE_SHEETS_ID")
    }
  }
}

testConnection()
