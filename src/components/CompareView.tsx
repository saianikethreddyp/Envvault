'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCw, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Variable {
    id: string;
    key: string;
    value: string;
}

interface Environment {
    id: string;
    name: string;
    variables: Variable[];
}

interface Project {
    id: string;
    name: string;
    environments: Environment[];
}

interface Props {
    project: Project;
}

export default function CompareView({ project }: Props) {
    const router = useRouter();
    const [sourceEnvId, setSourceEnvId] = useState(project.environments[0]?.id || '');
    const [targetEnvId, setTargetEnvId] = useState(project.environments[1]?.id || '');
    const [syncing, setSyncing] = useState<string | null>(null);

    const sourceEnv = project.environments.find(e => e.id === sourceEnvId);
    const targetEnv = project.environments.find(e => e.id === targetEnvId);

    // Calculate Diff
    const allKeys = new Set([
        ...(sourceEnv?.variables.map(v => v.key) || []),
        ...(targetEnv?.variables.map(v => v.key) || [])
    ]);

    const diff = Array.from(allKeys).map(key => {
        const sourceVar = sourceEnv?.variables.find(v => v.key === key);
        const targetVar = targetEnv?.variables.find(v => v.key === key);

        let status: 'ok' | 'missing_source' | 'missing_target' | 'mismatch' = 'ok';

        if (!sourceVar) status = 'missing_source';
        else if (!targetVar) status = 'missing_target';
        else if (sourceVar.value !== targetVar.value) status = 'mismatch';

        return { key, sourceVar, targetVar, status };
    }).sort((a, b) => a.key.localeCompare(b.key));

    const handleSync = async (key: string, value: string) => {
        if (!targetEnv) return;
        setSyncing(key);

        try {
            const res = await fetch('/api/variables/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    environmentId: targetEnv.id,
                    variables: [{ key, value }]
                }),
            });

            if (res.ok) {
                toast.success(`Synced ${key}`);
                router.refresh();
            } else {
                toast.error('Failed to sync');
            }
        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Sync failed');
        } finally {
            setSyncing(null);
        }
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-6 transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Project
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Compare Environments</h1>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center mb-8">
                <div className="card p-4">
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Source Environment</label>
                    <select
                        value={sourceEnvId}
                        onChange={(e) => setSourceEnvId(e.target.value)}
                        className="input"
                    >
                        {project.environments.map(env => (
                            <option key={env.id} value={env.id} disabled={env.id === targetEnvId}>{env.name}</option>
                        ))}
                    </select>
                </div>

                <div className="text-[var(--text-muted)]">
                    <ArrowRight className="w-6 h-6" />
                </div>

                <div className="card p-4">
                    <label className="text-xs text-[var(--text-muted)] mb-1 block">Target Environment</label>
                    <select
                        value={targetEnvId}
                        onChange={(e) => setTargetEnvId(e.target.value)}
                        className="input"
                    >
                        {project.environments.map(env => (
                            <option key={env.id} value={env.id} disabled={env.id === sourceEnvId}>{env.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Diff Table */}
            <div className="card overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                            <th className="p-4 font-medium text-[var(--text-secondary)] w-1/4">Key</th>
                            <th className="p-4 font-medium text-[var(--text-secondary)] w-1/3">
                                {sourceEnv?.name} Value
                            </th>
                            <th className="p-4 font-medium text-[var(--text-secondary)] w-1/3">
                                {targetEnv?.name} Value
                            </th>
                            <th className="p-4 font-medium text-[var(--text-secondary)] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {diff.map((item) => (
                            <tr key={item.key} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors">
                                <td className="p-4 font-mono text-sm">
                                    <div className="flex items-center gap-2">
                                        {item.status === 'missing_target' && <AlertCircle className="w-4 h-4 text-[var(--accent-pink)]" />}
                                        {item.status === 'missing_source' && <AlertCircle className="w-4 h-4 text-[var(--text-muted)]" />}
                                        {item.status === 'mismatch' && <RefreshCw className="w-4 h-4 text-[var(--accent-cyan)]" />}
                                        {item.key}
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-sm break-all text-[var(--text-muted)]">
                                    {item.sourceVar ? (
                                        item.sourceVar.value
                                    ) : (
                                        <span className="opacity-30 italic">Missing</span>
                                    )}
                                </td>
                                <td className="p-4 font-mono text-sm break-all text-[var(--text-muted)]">
                                    {item.targetVar ? (
                                        <span className={item.status === 'mismatch' ? 'text-[var(--accent-cyan)]' : ''}>
                                            {item.targetVar.value}
                                        </span>
                                    ) : (
                                        <span className="text-[var(--accent-pink)] italic">Missing</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {item.status === 'missing_target' && item.sourceVar && (
                                        <button
                                            onClick={() => handleSync(item.key, item.sourceVar!.value)}
                                            disabled={syncing === item.key}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {syncing === item.key ? (
                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <ArrowRight className="w-3 h-3" />
                                            )}
                                            Sync
                                        </button>
                                    )}
                                    {item.status === 'mismatch' && item.sourceVar && (
                                        <button
                                            onClick={() => handleSync(item.key, item.sourceVar!.value)}
                                            disabled={syncing === item.key}
                                            className="btn btn-secondary btn-sm text-xs"
                                        >
                                            Update
                                        </button>
                                    )}
                                    {item.status === 'ok' && (
                                        <Check className="w-4 h-4 text-[var(--accent-cyan)] ml-auto opacity-50" />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
