import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// Validate environment variables
if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is required")
}

if (!process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error("GOOGLE_PRIVATE_KEY environment variable is required")
}

if (!process.env.GOOGLE_SHEETS_ID) {
  throw new Error("GOOGLE_SHEETS_ID environment variable is required")
}

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth)

export async function getInternsSheet() {
  try {
    await doc.loadInfo()
    let sheet = doc.sheetsByTitle["Interns"]

    if (!sheet) {
      // Create the sheet if it doesn't exist
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
      console.log("Created new Interns sheet")
    }

    return sheet
  } catch (error) {
    console.error("Error accessing Google Sheets:", error)
    throw new Error("Failed to access Google Sheets. Please check your configuration.")
  }
}

export async function getAllInterns() {
  try {
    const sheet = await getInternsSheet()
    const rows = await sheet.getRows()

    return rows
      .map((row) => {
        try {
          return {
            id: row.get("ID") || "",
            name: row.get("Name") || "",
            email: row.get("Email") || "",
            phone: row.get("Phone") || "",
            dateOfBirth: row.get("DateOfBirth") || "",
            fatherName: row.get("FatherName") || "",
            motherName: row.get("MotherName") || "",
            photo: row.get("Photo") || "",
            linkedinProfile: row.get("LinkedInProfile") || "",
            internshipFields: JSON.parse(row.get("InternshipFields") || "[]"),
            totalMonthsCompleted: Number.parseInt(row.get("TotalMonthsCompleted") || "0"),
            onlineMonthsCompleted: Number.parseInt(row.get("OnlineMonthsCompleted") || "0"),
            offlineMonthsCompleted: Number.parseInt(row.get("OfflineMonthsCompleted") || "0"),
            certificateIssueDate: row.get("CertificateIssueDate") || "",
            createdAt: row.get("CreatedAt") || "",
          }
        } catch (parseError) {
          console.error("Error parsing row data:", parseError)
          return null
        }
      })
      .filter(Boolean) // Remove null entries
  } catch (error) {
    console.error("Error fetching all interns:", error)
    throw new Error("Failed to fetch interns from Google Sheets")
  }
}

export async function getInternById(id: string) {
  try {
    const sheet = await getInternsSheet()
    const rows = await sheet.getRows()

    const row = rows.find((row) => row.get("ID") === id)
    if (!row) return null

    return {
      id: row.get("ID") || "",
      name: row.get("Name") || "",
      email: row.get("Email") || "",
      phone: row.get("Phone") || "",
      dateOfBirth: row.get("DateOfBirth") || "",
      fatherName: row.get("FatherName") || "",
      motherName: row.get("MotherName") || "",
      photo: row.get("Photo") || "",
      linkedinProfile: row.get("LinkedInProfile") || "",
      internshipFields: JSON.parse(row.get("InternshipFields") || "[]"),
      totalMonthsCompleted: Number.parseInt(row.get("TotalMonthsCompleted") || "0"),
      onlineMonthsCompleted: Number.parseInt(row.get("OnlineMonthsCompleted") || "0"),
      offlineMonthsCompleted: Number.parseInt(row.get("OfflineMonthsCompleted") || "0"),
      certificateIssueDate: row.get("CertificateIssueDate") || "",
      createdAt: row.get("CreatedAt") || "",
    }
  } catch (error) {
    console.error("Error fetching intern by ID:", error)
    throw new Error("Failed to fetch intern from Google Sheets")
  }
}

export async function addIntern(internData: any) {
  try {
    const sheet = await getInternsSheet()

    await sheet.addRow({
      ID: internData.id,
      Name: internData.name,
      Email: internData.email,
      Phone: internData.phone,
      DateOfBirth: internData.dateOfBirth,
      FatherName: internData.fatherName,
      MotherName: internData.motherName,
      Photo: internData.photo,
      LinkedInProfile: internData.linkedinProfile,
      InternshipFields: JSON.stringify(internData.internshipFields),
      TotalMonthsCompleted: internData.totalMonthsCompleted,
      OnlineMonthsCompleted: internData.onlineMonthsCompleted,
      OfflineMonthsCompleted: internData.offlineMonthsCompleted,
      CertificateIssueDate: internData.certificateIssueDate,
      CreatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error adding intern:", error)
    throw new Error("Failed to add intern to Google Sheets")
  }
}

export async function deleteIntern(id: string) {
  try {
    const sheet = await getInternsSheet()
    const rows = await sheet.getRows()

    const rowIndex = rows.findIndex((row) => row.get("ID") === id)
    if (rowIndex !== -1) {
      await rows[rowIndex].delete()
      return true
    }
    return false
  } catch (error) {
    console.error("Error deleting intern:", error)
    throw new Error("Failed to delete intern from Google Sheets")
  }
}

export async function searchInterns(query: string) {
  try {
    const allInterns = await getAllInterns()

    return allInterns.filter(
      (intern) =>
        intern.name.toLowerCase().includes(query.toLowerCase()) ||
        intern.email.toLowerCase().includes(query.toLowerCase()) ||
        intern.phone.includes(query) ||
        intern.id.includes(query) ||
        intern.internshipFields.some((field: any) => field.field.toLowerCase().includes(query.toLowerCase())),
    )
  } catch (error) {
    console.error("Error searching interns:", error)
    throw new Error("Failed to search interns in Google Sheets")
  }
}

// Utility function to test connection
export async function testConnection() {
  try {
    await doc.loadInfo()
    return {
      success: true,
      title: doc.title,
      sheetCount: doc.sheetCount,
    }
  } catch (error) {
    console.error("Connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
