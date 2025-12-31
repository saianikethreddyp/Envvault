'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface Props {
    projectId: string;
    projectName: string;
}

export default function DeleteProjectButton({ projectId, projectName }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/projects');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-3 bg-[var(--accent-pink-dim)] border border-[var(--accent-pink)] border-opacity-30 rounded-lg px-4 py-2">
                <span className="text-sm text-[var(--accent-pink)]">Delete &quot;{projectName}&quot;?</span>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="btn btn-sm bg-[var(--accent-pink)] text-white hover:opacity-90"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    className="btn btn-secondary btn-sm"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="btn btn-secondary hover:bg-[var(--accent-pink-dim)] hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] transition-all"
        >
            <Trash2 className="w-4 h-4" />
            Delete
        </button>
    );
}
