'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    Plus,
    Key,
    HelpCircle,
    Search
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '#', label: 'Help Center', icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar fixed left-0 top-0 h-screen w-60 flex flex-col z-50">
            {/* Logo */}
            <div className="p-5 border-b border-[var(--border-color)]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--accent-cyan)] flex items-center justify-center">
                        <Key className="w-5 h-5 text-[#0d0d12]" />
                    </div>
                    <span className="text-lg font-semibold">EnvVault</span>
                </Link>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="search-bar">
                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* New Project Button */}
            <div className="p-4 border-t border-[var(--border-color)]">
                <Link
                    href="/projects/new"
                    className="btn btn-primary w-full"
                >
                    <Plus className="w-4 h-4" />
                    New Project
                </Link>
            </div>
        </aside>
    );
}
