'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Palette, Database, Shield, Info, Monitor } from 'lucide-react';

export default function SettingsPage() {
    const [theme, setTheme] = useState('dark');

    return (
        <div className="animate-fade-in max-w-2xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Settings</h1>
                <p className="text-[var(--text-secondary)] text-sm">Customize your EnvVault experience</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
                {/* Appearance */}
                <div className="card p-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="icon-box purple">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Appearance</h2>
                            <p className="text-sm text-[var(--text-muted)]">Customize the look and feel</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                                <div>
                                    <p className="font-medium text-sm">Theme</p>
                                    <p className="text-xs text-[var(--text-muted)]">Choose your preferred theme</p>
                                </div>
                            </div>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="input w-auto"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Storage */}
                <div className="card p-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="icon-box blue">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Storage</h2>
                            <p className="text-sm text-[var(--text-muted)]">Manage your data storage</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-medium text-sm">Local Database</p>
                            <span className="badge badge-dev">Active</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mb-3">
                            All your data is stored locally in a SQLite database. Your secrets never leave your machine.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-[var(--accent-cyan)]">
                            <Shield className="w-4 h-4" />
                            <span>100% local storage - No cloud sync</span>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="card p-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="icon-box pink">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">About</h2>
                            <p className="text-sm text-[var(--text-muted)]">Application information</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-sm">EnvVault</p>
                                <span className="text-sm text-[var(--text-muted)]">v1.0.0</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">
                                A modern, secure environment variable manager built with Next.js and Tailwind CSS.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-[var(--accent-cyan-dim)] border border-[var(--accent-cyan)] border-opacity-30">
                            <p className="text-sm text-[var(--accent-cyan)]">
                                <strong>Tech Stack:</strong> Next.js 14 • Tailwind CSS • Prisma • SQLite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
