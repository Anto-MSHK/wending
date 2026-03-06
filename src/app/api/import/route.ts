import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Household from '@/models/Household';
import Guest from '@/models/Guest';

/**
 * Expected JSON format:
 * [
 *   {
 *     "householdName": "The Does",
 *     "addressLine": "123 Main St",
 *     "city": "Springfield",
 *     "members": [
 *       {
 *         "guestName": "John Doe",
 *         "gender": "male",
 *         "isHeadOfHousehold": true,
 *         "age": 30
 *       },
 *       {
 *         "guestName": "Jane Doe",
 *         "gender": "female",
 *         "isHeadOfHousehold": false
 *       }
 *     ]
 *   }
 * ]
 */

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const data = await request.json();

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Payload must be an array of households' }, { status: 400 });
        }

        const results = {
            householdsCreated: 0,
            guestsCreated: 0,
            errors: [] as string[]
        };

        for (const item of data) {
            try {
                if (item.members && Array.isArray(item.members)) {
                    // It's a Household with members
                    const { members, ...hData } = item;
                    const household = await Household.create({
                        ...hData,
                        householdName: hData.householdName || 'New Household'
                    });
                    results.householdsCreated++;

                    for (const guestData of members) {
                        try {
                            await Guest.create({
                                ...guestData,
                                householdId: household._id
                            });
                            results.guestsCreated++;
                        } catch (guestErr: any) {
                            results.errors.push(`Error creating guest ${guestData.guestName}: ${guestErr.message}`);
                        }
                    }
                } else if (item.guestName) {
                    // It's an individual Guest
                    await Guest.create({
                        ...item,
                        isHeadOfHousehold: false // Individual guests aren't heads of families by default
                    });
                    results.guestsCreated++;
                } else {
                    results.errors.push(`Invalid item format: ${JSON.stringify(item)}`);
                }
            } catch (err: any) {
                results.errors.push(`Processing error: ${err.message}${err.errors ? ' - ' + JSON.stringify(err.errors) : ''}`);
            }
        }

        return NextResponse.json({
            message: 'Import completed',
            ...results
        }, { status: 201 });

    } catch (error: any) {
        console.error('Import API error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
