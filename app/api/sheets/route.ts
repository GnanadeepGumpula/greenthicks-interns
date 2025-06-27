import { NextResponse } from 'next/server';
import { getInternById, searchInterns, addIntern } from '@/lib/google-sheets';

// Interface for intern data (matches lib/google-sheets.ts)
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
  internshipFields: string | string[];
  totalMonthsCompleted: number;
  onlineMonthsCompleted: number;
  offlineMonthsCompleted: number;
  certificateIssueDate: string;
  createdAt: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: 'Search query is required',
        },
        { status: 400 }
      );
    }

    // Search by ID first (exact match)
    if (query.length === 6 && /^\d+$/.test(query)) {
      const intern = await getInternById(query);
      if (intern) {
        return NextResponse.json({
          success: true,
          data: intern,
        });
      }
    }

    // Search by other criteria
    const results = await searchInterns(query);
    if (results.length > 0) {
      return NextResponse.json({
        success: true,
        data: results[0], // Return first match for single intern lookup
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'No intern found',
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error searching interns:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to search interns. Please check your Google Sheets configuration.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Generate unique 6-digit ID
    const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();

    const internData: Intern = {
      id: uniqueId,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '',
      fatherName: data.fatherName || '',
      motherName: data.motherName || '',
      photo: data.photo || '',
      linkedinProfile: data.linkedinProfile || '',
      internshipFields: data.internshipFields || [], // Expect array
      totalMonthsCompleted: parseInt(data.totalMonthsCompleted) || 0,
      onlineMonthsCompleted: parseInt(data.onlineMonthsCompleted) || 0,
      offlineMonthsCompleted: parseInt(data.offlineMonthsCompleted) || 0,
      certificateIssueDate: data.certificateIssueDate || '',
      createdAt: new Date().toISOString(),
    };

    const addedIntern = await addIntern(internData);

    return NextResponse.json({
      success: true,
      data: addedIntern,
    });
  } catch (error: any) {
    console.error('Error creating intern:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create intern. Please check your Google Sheets configuration.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}