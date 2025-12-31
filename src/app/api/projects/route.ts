import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects - List all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                environments: {
                    include: {
                        _count: {
                            select: { variables: true }
                        }
                    }
                }
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        // Create project with default environments
        const project = await prisma.project.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                environments: {
                    create: [
                        { name: 'development' },
                        { name: 'staging' },
                        { name: 'production' },
                    ]
                }
            },
            include: {
                environments: true
            }
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Failed to create project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
