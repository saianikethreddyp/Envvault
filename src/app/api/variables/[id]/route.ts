import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
    params: Promise<{ id: string }>;
}

// PUT /api/variables/:id - Update a variable
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { key, value } = body;

        const variable = await prisma.envVariable.update({
            where: { id },
            data: {
                key: key?.trim(),
                value: value?.trim()
            }
        });

        return NextResponse.json(variable);
    } catch (error) {
        console.error('Failed to update variable:', error);
        return NextResponse.json({ error: 'Failed to update variable' }, { status: 500 });
    }
}

// DELETE /api/variables/:id - Delete a variable
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;

        await prisma.envVariable.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete variable:', error);
        return NextResponse.json({ error: 'Failed to delete variable' }, { status: 500 });
    }
}
