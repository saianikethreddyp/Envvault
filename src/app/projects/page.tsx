import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FolderKanban, Plus, Search } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';

async function getProjects() {
    return prisma.project.findMany({
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
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Projects</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Manage your projects and environment variables</p>
                </div>
                <Link href="/projects/new" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="search-bar max-w-md">
                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                    />
                </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="icon-box cyan mx-auto mb-6 w-16 h-16">
                        <FolderKanban className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No projects yet</h2>
                    <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                        Create your first project to start organizing your environment variables
                    </p>
                    <Link href="/projects/new" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Create Your First Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
