# 📊 Google Sheets Database Setup Guide

This guide will help you set up Google Sheets as your database for the Internship Management System.

## 🎯 Overview

Your Google Sheets will serve as the database with the following structure:
- **Sheet Name**: "Interns"
- **Columns**: 15 columns for all intern data
- **Access**: Via Google Sheets API with service account

## 📋 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select existing project
3. Name your project (e.g., "Internship Management")
4. Click "Create"

### Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"
4. Wait for activation (usually takes a few seconds)

### Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in details:
   - **Service account name**: `internship-sheets-service`
   - **Service account ID**: (auto-generated)
   - **Description**: `Service account for internship management system`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### Step 4: Generate Service Account Key

1. Click on the created service account email
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Click "Create"
6. **IMPORTANT**: Download and save the JSON file securely
7. **NEVER** commit this file to version control

### Step 5: Create Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create new spreadsheet
3. Rename it to "Green Thicks Internship Database"
4. Copy the spreadsheet ID from URL:
   \`\`\`
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   \`\`\`

### Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share" button
2. Add the service account email (from the JSON file)
   - Email looks like: `internship-sheets-service@project-id.iam.gserviceaccount.com`
3. Set permission to "Editor"
4. Uncheck "Notify people"
5. Click "Share"

### Step 7: Set Environment Variables

Create `.env.local` file in your project root:

\`\`\`env
# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_spreadsheet_id_from_step_5
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON file\n-----END PRIVATE KEY-----\n"
\`\`\`

**Important Notes:**
- Replace `your_spreadsheet_id_from_step_5` with actual ID
- Replace email with your service account email
- Replace private key with the full private key from JSON file
- Keep the quotes and newline characters (`\n`) in the private key

### Step 8: Install Dependencies

\`\`\`bash
npm install google-spreadsheet google-auth-library
\`\`\`

### Step 9: Run Setup Script

\`\`\`bash
node scripts/setup-google-sheets.js
\`\`\`

This will:
- Test your connection
- Create the "Interns" sheet with proper headers
- Verify everything is working

### Step 10: Test Connection

\`\`\`bash
node scripts/test-connection.js
\`\`\`

This will verify your setup is working correctly.

## 📊 Sheet Structure

The system will automatically create a sheet with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| ID | 6-digit unique identifier | 123456 |
| Name | Full name | John Doe |
| Email | Email address | john@email.com |
| Phone | Phone number | +1-555-123-4567 |
| DateOfBirth | Birth date | 1995-06-15 |
| FatherName | Father's name | Robert Doe |
| MotherName | Mother's name | Mary Doe |
| Photo | Photo URL | https://... |
| LinkedInProfile | LinkedIn URL | https://linkedin.com/in/... |
| InternshipFields | JSON array of fields | [{"field":"Frontend",...}] |
| TotalMonthsCompleted | Total months | 6 |
| OnlineMonthsCompleted | Online months | 3 |
| OfflineMonthsCompleted | Offline months | 3 |
| CertificateIssueDate | Issue date | 2024-08-01 |
| CreatedAt | Creation timestamp | 2024-01-15T10:30:00Z |

## 🔧 Troubleshooting

### Common Issues:

**1. "Failed to access Google Sheets"**
- Check if Google Sheets API is enabled
- Verify service account has access to the sheet
- Ensure environment variables are correct

**2. "Permission denied"**
- Make sure you shared the sheet with service account email
- Check if service account has "Editor" permissions

**3. "Spreadsheet not found"**
- Verify GOOGLE_SHEETS_ID is correct
- Check if the spreadsheet exists and is accessible

**4. "Invalid private key"**
- Ensure private key includes `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep all `\n` characters in the key
- Wrap the entire key in quotes

### Testing Commands:

\`\`\`bash
# Test connection
node scripts/test-connection.js

# Reset and setup again
node scripts/setup-google-sheets.js

# Check environment variables
echo $GOOGLE_SHEETS_ID
\`\`\`

## 🚀 Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Add all environment variables to your hosting platform
2. Ensure the private key is properly escaped
3. Test the connection after deployment
4. Monitor logs for any Google Sheets API errors

## 📈 Usage

Once setup is complete:

1. **Admin Panel**: Add interns through `/admin`
2. **Public Search**: Search interns on homepage
3. **QR Codes**: Generate QR codes for certificates
4. **Data Export**: Export data as CSV from admin panel

Your Google Sheets will automatically update with all intern data!
