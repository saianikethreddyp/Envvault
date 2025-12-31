import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
    params: Promise<{ projectId: string; env: string }>;
}

// GET /api/export/:projectId/:env - Export environment variables as .env file
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { projectId, env } = await params;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                environments: {
                    where: { name: env },
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

        const environment = project.environments[0];
        if (!environment) {
            return NextResponse.json({ error: 'Environment not found' }, { status: 404 });
        }

        // Generate .env file content
        const envContent = environment.variables
            .map((v) => `${v.key}=${v.value}`)
            .join('\n');

        // Return as downloadable file
        return new NextResponse(envContent, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="${project.name.toLowerCase().replace(/\s+/g, '-')}-${env}.env"`,
            },
        });
    } catch (error) {
        console.error('Failed to export variables:', error);
        return NextResponse.json({ error: 'Failed to export variables' }, { status: 500 });
    }
}
