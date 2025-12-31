import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EnvTable from '@/components/EnvTable';
import AddVariableForm from '@/components/AddVariableForm';
import DeleteProjectButton from '@/components/DeleteProjectButton';
import EnvironmentHeader from '@/components/EnvironmentHeader';

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

export default async function ProjectDetailPage({ params }: Props) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    const envOrder = ['development', 'staging', 'production'];
    const sortedEnvs = project.environments.sort(
        (a, b) => envOrder.indexOf(a.name) - envOrder.indexOf(b.name)
    );

    const envColors: Record<string, string> = {
        development: 'cyan',
        staging: 'purple',
        production: 'pink',
    };

    return (
        <div className="animate-fade-in">
            {/* Back Button */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-6 transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        {project.description || 'No description provided'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/projects/${project.id}/compare`}
                        className="btn btn-secondary"
                    >
                        Compare Environments
                    </Link>
                    <DeleteProjectButton projectId={project.id} projectName={project.name} />
                </div>
            </div>

            {/* Environment Cards */}
            <div className="space-y-6">
                {sortedEnvs.map((env, index) => (
                    <div
                        key={env.id}
                        className="card animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <EnvironmentHeader
                            project={project}
                            env={env}
                            envColor={envColors[env.name] || 'cyan'}
                        />

                        {/* Add Variable Form */}
                        <div className="p-5 border-b border-[var(--border-color)]">
                            <AddVariableForm environmentId={env.id} />
                        </div>

                        {/* Variables Table */}
                        <div className="p-5">
                            {env.variables.length > 0 ? (
                                <EnvTable variables={env.variables} />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-[var(--text-muted)]">No variables in this environment yet</p>
                                    <p className="text-sm text-[var(--text-muted)]">Add your first variable above</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
