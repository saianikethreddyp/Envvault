'use client';

import { useState } from 'react';
import { Loader2, X, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Props {
    environmentId: string;
    onClose: () => void;
}

export default function ImportEnvModal({ environmentId, onClose }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const parseEnv = (text: string) => {
        const lines = text.split('\n');
        const variables = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            const eqIdx = trimmed.indexOf('=');
            if (eqIdx === -1) continue;

            const key = trimmed.slice(0, eqIdx).trim();
            let value = trimmed.slice(eqIdx + 1).trim();

            // Remove surrounding quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            if (key) {
                variables.push({ key, value });
            }
        }
        return variables;
    };

    const handleSubmit = async () => {
        const variables = parseEnv(content);
        if (variables.length === 0) {
            toast.error('No valid variables found');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/variables/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ environmentId, variables }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Successfully imported ${data.count} variables`);
                router.refresh();
                onClose();
            } else {
                toast.error('Failed to import variables');
            }
        } catch (error) {
            console.error('Failed to import:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setContent(text);
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] shrink-0">
                    <h2 className="text-xl font-bold">Import .env</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    <div className="p-8 border-2 border-dashed border-[var(--border-color)] rounded-lg hover:border-[var(--accent-cyan)] transition-colors text-center cursor-pointer relative group">
                        <input
                            type="file"
                            accept=".env,text/plain"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-2 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                            <Upload className="w-8 h-8 opacity-50" />
                            <p className="text-sm">Click to upload .env file or drag and drop</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute top-3 left-3 text-[var(--text-muted)] pointer-events-none">
                            <FileText className="w-4 h-4" />
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Or paste your .env content here...&#10;KEY=VALUE&#10;ANOTHER_KEY=something"
                            className="input font-mono min-h-[200px] pl-10 resize-y"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)] rounded-b-xl shrink-0">
                    <p className="text-xs text-[var(--text-muted)]">
                        {content ? `${parseEnv(content).length} variables detected` : 'No content'}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !content.trim()}
                            className="btn btn-primary"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import Variables'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
