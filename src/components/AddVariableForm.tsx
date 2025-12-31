'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
    environmentId: string;
}

export default function AddVariableForm({ environmentId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        value: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.key.trim() || !formData.value.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/variables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    environmentId,
                }),
            });

            if (res.ok) {
                toast.success('Variable added successfully');
                setFormData({ key: '', value: '' });
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error('Failed to add variable');
            }
        } catch (error) {
            console.error('Failed to add variable:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-[var(--accent-cyan)] hover:text-[#00e6b8] transition-colors text-sm font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Variable
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">KEY</label>
                <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })}
                    placeholder="VARIABLE_NAME"
                    className="input font-mono text-sm"
                />
            </div>
            <div className="flex-[2] min-w-[300px]">
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">VALUE</label>
                <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter value..."
                    className="input font-mono text-sm"
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading || !formData.key.trim() || !formData.value.trim()}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    Add
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setFormData({ key: '', value: '' });
                    }}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
