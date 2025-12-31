'use client';

import { useState } from 'react';
import { Download, Upload, Shield } from 'lucide-react';
import ImportEnvModal from '@/components/ImportEnvModal';

interface Props {
    project: { id: string };
    env: { id: string; name: string; variables: any[] };
    envColor: string;
}

export default function EnvironmentHeader({ project, env, envColor }: Props) {
    const [showImport, setShowImport] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <div className={`icon-box ${envColor}`}>
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold capitalize">{env.name}</h2>
                            <span className={`badge badge-${env.name === 'development' ? 'dev' : env.name}`}>
                                {env.variables.length} variables
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                            {env.name === 'development' && 'Local development environment'}
                            {env.name === 'staging' && 'Pre-production testing environment'}
                            {env.name === 'production' && 'Live production environment'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowImport(true)}
                        className="btn btn-secondary btn-sm"
                    >
                        <Upload className="w-4 h-4" />
                        Import
                    </button>
                    <a
                        href={`/api/export/${project.id}/${env.name}`}
                        className="btn btn-secondary btn-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </a>
                </div>
            </div>

            {showImport && (
                <ImportEnvModal
                    environmentId={env.id}
                    onClose={() => setShowImport(false)}
                />
            )}
        </>
    );
}
