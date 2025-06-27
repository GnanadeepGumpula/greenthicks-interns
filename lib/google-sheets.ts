import { google } from 'googleapis';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' }); // Adjusted path assuming .env is in project root

// Interface for intern data
interface Intern {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  photo: string;
  linkedinProfile: string;
  internshipFields: string | string[]; // Support JSON string or parsed array
  totalMonthsCompleted: number;
  onlineMonthsCompleted: number;
  offlineMonthsCompleted: number;
  certificateIssueDate: string;
  createdAt: string;
}

// Initialize auth
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function getInternsSheet() {
  try {
    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY environment variable is missing');
    }
    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is missing');
    }

    // Get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      fields: 'properties.title,sheets(properties.sheetId,properties.title)',
    });

    // Check for Interns sheet
    let sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Interns');
    let sheetId: number | undefined;

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
      sheetId = createResponse.data.replies?.[0]?.addSheet?.properties?.sheetId;
      if (!sheetId) {
        throw new Error('Failed to retrieve sheetId for new Interns sheet');
      }

      // Set headers
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
      console.log('Created and initialized Interns sheet');
    } else {
      sheetId = sheet.properties?.sheetId;
      if (!sheetId) {
        throw new Error('Interns sheet exists but sheetId is missing');
      }
      console.log('Interns sheet already exists');
    }

    return { sheets, sheetId };
  } catch (error: any) {
    console.error('Error accessing Google Sheets:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to access Google Sheets. Please check your configuration.');
  }
}

export async function getAllInterns(): Promise<Intern[]> {
  try {
    const { sheets } = await getInternsSheet();

    // Fetch all data from the Interns sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Interns!A:O',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return []; // No data (excluding header row)
    }

    // Map rows to Intern objects, skipping the header row
    const interns: Intern[] = rows.slice(1).map((row) => {
      try {
        return {
          id: row[0] || '',
          name: row[1] || '',
          email: row[2] || '',
          phone: row[3] || '',
          dateOfBirth: row[4] || '',
          fatherName: row[5] || '',
          motherName: row[6] || '',
          photo: row[7] || '',
          linkedinProfile: row[8] || '',
          internshipFields: row[9] ? JSON.parse(row[9]) : [], // Parse JSON string
          totalMonthsCompleted: parseInt(row[10]) || 0,
          onlineMonthsCompleted: parseInt(row[11]) || 0,
          offlineMonthsCompleted: parseInt(row[12]) || 0,
          certificateIssueDate: row[13] || '',
          createdAt: row[14] || '',
        };
      } catch (parseError) {
        console.error('Error parsing row data:', parseError);
        return null;
      }
    }).filter((intern): intern is Intern => intern !== null);

    console.log(`Fetched ${interns.length} interns from Google Sheets`);
    return interns;
  } catch (error: any) {
    console.error('Error fetching all interns:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to fetch interns from Google Sheets');
  }
}

export async function getInternById(id: string): Promise<Intern | null> {
  try {
    const interns = await getAllInterns();
    const intern = interns.find((intern) => intern.id === id);
    return intern || null;
  } catch (error: any) {
    console.error('Error fetching intern by ID:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to fetch intern from Google Sheets');
  }
}

export async function addIntern(internData: any): Promise<Intern> {
  try {
    // Validate required fields
    if (!internData.id || !internData.name || !internData.email) {
      throw new Error('Missing required intern fields (id, name, email)');
    }

    const { sheets } = await getInternsSheet();

    const intern: Intern = {
      id: internData.id,
      name: internData.name,
      email: internData.email,
      phone: internData.phone || '',
      dateOfBirth: internData.dateOfBirth || '',
      fatherName: internData.fatherName || '',
      motherName: internData.motherName || '',
      photo: internData.photo || '',
      linkedinProfile: internData.linkedinProfile || '',
      internshipFields: internData.internshipFields || [], // Expect array or JSON string
      totalMonthsCompleted: parseInt(internData.totalMonthsCompleted) || 0,
      onlineMonthsCompleted: parseInt(internData.onlineMonthsCompleted) || 0,
      offlineMonthsCompleted: parseInt(internData.offlineMonthsCompleted) || 0,
      certificateIssueDate: internData.certificateIssueDate || '',
      createdAt: internData.createdAt || new Date().toISOString(),
    };

    // Append intern data
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Interns!A:O',
      valueInputOption: 'RAW',
      resource: {
        values: [
          [
            intern.id,
            intern.name,
            intern.email,
            intern.phone,
            intern.dateOfBirth,
            intern.fatherName,
            intern.motherName,
            intern.photo,
            intern.linkedinProfile,
            JSON.stringify(intern.internshipFields), // Store as JSON string
            intern.totalMonthsCompleted.toString(),
            intern.onlineMonthsCompleted.toString(),
            intern.offlineMonthsCompleted.toString(),
            intern.certificateIssueDate,
            intern.createdAt,
          ],
        ],
      },
    });

    console.log(`Added intern ${intern.name} to Google Sheets`);
    return intern;
  } catch (error: any) {
    console.error('Error adding intern:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to add intern to Google Sheets');
  }
}

export async function deleteIntern(id: string): Promise<boolean> {
  try {
    const { sheets, sheetId } = await getInternsSheet();

    // Fetch all rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Interns!A:O',
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return false; // No data (excluding header row)
    }

    // Find row index (1-based for API, accounting for header)
    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) {
      return false; // Intern not found
    }

    // Delete the row (rowIndex + 1 to account for 1-based indexing)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    console.log(`Deleted intern with ID ${id} from Google Sheets`);
    return true;
  } catch (error: any) {
    console.error('Error deleting intern:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to delete intern from Google Sheets');
  }
}

export async function searchInterns(query: string): Promise<Intern[]> {
  try {
    const interns = await getAllInterns();

    return interns.filter((intern) => {
      const internshipFields = Array.isArray(intern.internshipFields)
        ? intern.internshipFields
        : JSON.parse(intern.internshipFields || '[]');

      return (
        intern.name?.toLowerCase().includes(query.toLowerCase()) ||
        intern.email?.toLowerCase().includes(query.toLowerCase()) ||
        intern.phone?.includes(query) ||
        intern.id?.includes(query) ||
        internshipFields.some((field: any) =>
          field?.field?.toLowerCase().includes(query.toLowerCase())
        )
      );
    });
  } catch (error: any) {
    console.error('Error searching interns:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    throw new Error('Failed to search interns in Google Sheets');
  }
}

export async function testConnection() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      fields: 'properties.title,sheets.properties.title',
    });

    return {
      success: true,
      title: response.data.properties?.title,
      sheetCount: response.data.sheets?.length,
    };
  } catch (error: any) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}