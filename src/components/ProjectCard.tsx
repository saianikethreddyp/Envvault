'use client';

import Link from 'next/link';
import { FolderKanban, Key, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        description: string | null;
        environments: {
            name: string;
            _count: {
                variables: number;
            };
        }[];
    };
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const totalVars = project.environments.reduce((sum, env) => sum + env._count.variables, 0);

    const envCounts = {
        development: project.environments.find(e => e.name === 'development')?._count.variables || 0,
        staging: project.environments.find(e => e.name === 'staging')?._count.variables || 0,
        production: project.environments.find(e => e.name === 'production')?._count.variables || 0,
    };

    return (
        <Link
            href={`/projects/${project.id}`}
            className="card p-5 group cursor-pointer block animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="icon-box cyan group-hover:scale-110 transition-transform">
                    <FolderKanban className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-right">
                    <span className="text-2xl font-bold">{totalVars}</span>
                    <Key className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                {project.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                {project.description || 'No description provided'}
            </p>

            {/* Environment Stats */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]"></span>
                        Development
                    </span>
                    <span className="text-[var(--text-secondary)]">{envCounts.development} vars</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Staging
                    </span>
                    <span className="text-[var(--text-secondary)]">{envCounts.staging} vars</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)]"></span>
                        Production
                    </span>
                    <span className="text-[var(--text-secondary)]">{envCounts.production} vars</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                <span className="text-xs text-[var(--text-muted)]">
                    {project.environments.length} environments
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
}
