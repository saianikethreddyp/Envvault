'use client';

import { useState } from 'react';
import { Copy, Eye, EyeOff, Trash2, Check, Download, Edit2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditVariableModal from './EditVariableModal';
import toast from 'react-hot-toast';

interface Variable {
    id: string;
    key: string;
    value: string;
}

interface Props {
    variables: Variable[];
}

export default function EnvTable({ variables }: Props) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingVariable, setEditingVariable] = useState<Variable | null>(null);

    const filteredVariables = variables.filter(v =>
        v.key.toLowerCase().includes(search.toLowerCase()) ||
        v.value.toLowerCase().includes(search.toLowerCase())
    );

    const toggleVisibility = (id: string) => {
        setVisibleValues((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const copyToClipboard = async (id: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedId(id);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteVariable = async (id: string) => {
        if (!confirm('Are you sure you want to delete this variable?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/variables/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Variable deleted');
                router.refresh();
            } else {
                toast.error('Failed to delete variable');
            }
        } catch (error) {
            console.error('Failed to delete variable:', error);
            toast.error('Something went wrong');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute top-2.5 left-3 text-[var(--text-muted)] pointer-events-none">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search variables..."
                    className="input pl-10 w-full md:w-64"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVariables.map((variable) => (
                            <tr key={variable.id} className="group">
                                <td>
                                    <code className="text-[var(--accent-cyan)] bg-[var(--accent-cyan-dim)] px-2 py-1 rounded text-sm font-mono">
                                        {variable.key}
                                    </code>
                                </td>
                                <td className="max-w-md">
                                    <div className="flex items-center gap-2">
                                        <code className="text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded text-sm font-mono truncate max-w-xs border border-[var(--border-color)]">
                                            {visibleValues.has(variable.id) ? variable.value : '•'.repeat(Math.min(variable.value.length, 20))}
                                        </code>
                                        <button
                                            onClick={() => toggleVisibility(variable.id)}
                                            className="btn btn-ghost btn-sm p-2"
                                            title={visibleValues.has(variable.id) ? 'Hide value' : 'Show value'}
                                        >
                                            {visibleValues.has(variable.id) ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => copyToClipboard(variable.id, variable.value)}
                                            className="btn btn-ghost btn-sm p-2"
                                            title="Copy value"
                                        >
                                            {copiedId === variable.id ? (
                                                <Check className="w-4 h-4 text-[var(--accent-cyan)]" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(`${variable.key}=${variable.value}`)}
                                            className="btn btn-ghost btn-sm p-2"
                                            title="Copy as KEY=VALUE"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEditingVariable(variable)}
                                            className="btn btn-ghost btn-sm p-2"
                                            title="Edit variable"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteVariable(variable.id)}
                                            disabled={deletingId === variable.id}
                                            className="btn btn-ghost btn-sm p-2 hover:text-[var(--accent-pink)] hover:bg-[var(--accent-pink-dim)]"
                                            title="Delete variable"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredVariables.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-[var(--text-muted)]">
                                    No variables found matching "{search}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingVariable && (
                <EditVariableModal
                    variable={editingVariable}
                    onClose={() => setEditingVariable(null)}
                />
            )}
        </div>
    );
}
