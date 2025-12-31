import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/variables - Create a new variable
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, value, environmentId } = body;

        if (!key?.trim() || !value?.trim() || !environmentId) {
            return NextResponse.json(
                { error: 'Key, value, and environmentId are required' },
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

        // Check if variable with same key already exists
        const existing = await prisma.envVariable.findUnique({
            where: {
                environmentId_key: {
                    environmentId,
                    key: key.trim()
                }
            }
        });

        if (existing) {
            // Update existing variable
            const variable = await prisma.envVariable.update({
                where: { id: existing.id },
                data: { value: value.trim() }
            });
            return NextResponse.json(variable);
        }

        // Create new variable
        const variable = await prisma.envVariable.create({
            data: {
                key: key.trim(),
                value: value.trim(),
                environmentId
            }
        });

        return NextResponse.json(variable, { status: 201 });
    } catch (error) {
        console.error('Failed to create variable:', error);
        return NextResponse.json({ error: 'Failed to create variable' }, { status: 500 });
    }
}
