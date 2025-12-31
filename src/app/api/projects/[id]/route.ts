import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
    params: Promise<{ id: string }>;
}

// GET /api/projects/:id - Get a project by ID
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                environments: {
                    include: {
                        variables: {
                            orderBy: { key: 'asc' }
                        }
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Failed to fetch project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT /api/projects/:id - Update a project
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description } = body;

        const project = await prisma.project.update({
            where: { id },
            data: {
                name: name?.trim(),
                description: description?.trim() || null,
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Failed to update project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;

        await prisma.project.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
