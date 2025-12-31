import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/variables/batch - Create or update multiple variables
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { environmentId, variables } = body;

        if (!environmentId || !Array.isArray(variables) || variables.length === 0) {
            return NextResponse.json(
                { error: 'Environment ID and variables array are required' },
                { status: 400 }
            );
        }

        // Check if environment exists
        const environment = await prisma.environment.findUnique({
            where: { id: environmentId }
        });

        if (!environment) {
            return NextResponse.json({ error: 'Environment not found' }, { status: 404 });
        }

        const results = [];

        // Process each variable transactionally-ish
        // for simpler logic, we'll just loop and upsert
        // In a real high-throughput scenario, we might use createMany / updateMany logic more carefully
        // But since we need to match on (environmentId, key), upsert is safest per item.

        for (const v of variables) {
            const { key, value } = v;
            if (!key?.trim()) continue;

            // Upsert: Create or Update
            const variable = await prisma.envVariable.upsert({
                where: {
                    environmentId_key: {
                        environmentId,
                        key: key.trim().toUpperCase()
                    }
                },
                update: {
                    value: value?.trim() || ''
                },
                create: {
                    environmentId,
                    key: key.trim().toUpperCase(),
                    value: value?.trim() || ''
                }
            });
            results.push(variable);
        }

        return NextResponse.json({ success: true, count: results.length, variables: results }, { status: 201 });
    } catch (error) {
        console.error('Failed to batch import variables:', error);
        return NextResponse.json({ error: 'Failed to batch import variables' }, { status: 500 });
    }
}
