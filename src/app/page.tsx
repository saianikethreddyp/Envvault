import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FolderKanban, Key, Plus, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, FileKey, Shield } from 'lucide-react';

async function getStats() {
  const [projectCount, variableCount, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.envVariable.count(),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        environments: {
          include: {
            _count: {
              select: { variables: true }
            }
          }
        }
      }
    })
  ]);

  const environmentCount = await prisma.environment.count();

  return { projectCount, variableCount, environmentCount, recentProjects };
}

export default async function Dashboard() {
  const { projectCount, variableCount, environmentCount, recentProjects } = await getStats();

  const stats = [
    {
      label: 'Total Projects',
      value: projectCount,
      change: '+12.5%',
      positive: true,
      subtitle: `${projectCount} projects • Active`,
      icon: FolderKanban,
    },
    {
      label: 'Environment Variables',
      value: variableCount,
      change: '+8.2%',
      positive: true,
      subtitle: `${variableCount} secrets stored`,
      icon: Key,
    },
    {
      label: 'Environments',
      value: environmentCount,
      change: '+5.1%',
      positive: true,
      subtitle: `${environmentCount} total environments`,
      icon: Shield,
    },
    {
      label: 'Security Score',
      value: '98%',
      change: '+2.3%',
      positive: true,
      subtitle: 'All secrets encrypted',
      icon: FileKey,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="stat-card animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--text-secondary)] text-sm">{stat.label}</span>
                <span className={`stat-badge ${stat.positive ? 'positive' : 'negative'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownRight className="w-3 h-3 inline mr-1" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)]">{stat.subtitle}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 mb-6">


        {/* Variable Distribution */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Variable Distribution</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]"></span>
                Development
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)]"></span>
                Production
              </span>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-40 flex items-end justify-around gap-2">
            {[65, 45, 80, 55, 70, 40, 85, 60, 75, 50, 90, 45].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${height}%`,
                    background: i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-pink)',
                    opacity: 0.7 + (i * 0.02)
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-3">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-[var(--accent-cyan)] hover:underline">
              View All
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="p-8 text-center">
              <div className="icon-box cyan mx-auto mb-4">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h3 className="font-medium mb-2">No projects yet</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">Create your first project to get started</p>
              <Link href="/projects/new" className="btn btn-primary btn-sm">
                <Plus className="w-3 h-3" />
                Create Project
              </Link>
            </div>
          ) : (
            <div>
              {recentProjects.map((project, index) => {
                const totalVars = project.environments.reduce((sum, env) => sum + env._count.variables, 0);
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="list-item animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="icon-box cyan mr-4">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{project.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {project.description || 'No description'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{totalVars}</div>
                      <div className="text-xs text-[var(--text-muted)]">variables</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Environments */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-semibold">Top Environments</h2>
            <button className="text-sm text-[var(--text-secondary)] hover:text-white">
              Manage
            </button>
          </div>

          <div>
            {['development', 'staging', 'production'].map((env, index) => {
              const colors = {
                development: { bg: 'cyan', percent: 85 },
                staging: { bg: 'purple', percent: 73 },
                production: { bg: 'pink', percent: 92 },
              };
              const config = colors[env as keyof typeof colors];

              return (
                <div key={env} className="list-item animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className={`icon-box ${config.bg} mr-4`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{env}</span>
                      <span className="text-sm">{config.percent}% used</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`fill ${config.bg}`}
                        style={{ width: `${config.percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
