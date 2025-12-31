'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const project = await res.json();
                router.push(`/projects/${project.id}`);
            }
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-xl">
            {/* Back Button */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-white mb-6 transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
            </Link>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Create New Project</h1>
                <p className="text-[var(--text-secondary)] text-sm">
                    Set up a new project to organize your environment variables
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card p-6">
                <div className="space-y-5">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Project Name <span className="text-[var(--accent-pink)]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., My Awesome App"
                            className="input"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description <span className="text-[var(--text-muted)]">(optional)</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of your project..."
                            rows={3}
                            className="input resize-none"
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-[var(--accent-cyan-dim)] border border-[var(--accent-cyan)] border-opacity-30 rounded-lg p-4">
                        <p className="text-sm text-[var(--accent-cyan)]">
                            <strong>Note:</strong> Three environments will be created automatically:
                            <span className="badge badge-dev ml-2">development</span>
                            <span className="badge badge-staging ml-2">staging</span>
                            <span className="badge badge-production ml-2">production</span>
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className="w-full btn btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FolderPlus className="w-5 h-5" />
                                Create Project
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
