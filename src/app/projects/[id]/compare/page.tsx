import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CompareView from '@/components/CompareView';

interface Props {
    params: Promise<{ id: string }>;
}

async function getProject(id: string) {
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

    return project;
}

export default async function ComparePage({ params }: Props) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    return <CompareView project={project} />;
}
