import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import type { Distro } from '@/types';

interface ComparisonRadarChartProps {
    distros: Distro[];
}

// Colors for each distro (up to 4)
const COLORS = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(239, 68, 68, 0.8)',    // Red  
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(168, 85, 247, 0.8)',   // Purple
];

const FILL_COLORS = [
    'rgba(59, 130, 246, 0.3)',
    'rgba(239, 68, 68, 0.3)',
    'rgba(34, 197, 94, 0.3)',
    'rgba(168, 85, 247, 0.3)',
];

/**
 * Normalize a value to 0-100 scale
 */
function normalizeRAM(ram: number | undefined): number {
    if (!ram) return 50;
    // Lower RAM is better: 200MB = 100, 2000MB = 0
    const score = Math.max(0, 100 - ((ram - 200) / 18));
    return Math.min(100, Math.max(0, score));
}

function normalizeCPU(cpu: number | undefined): number {
    if (!cpu) return 50;
    // Higher CPU score is better: assume 0-100 range
    return Math.min(100, Math.max(0, cpu));
}

function normalizeIO(io: number | undefined): number {
    if (!io) return 50;
    // Higher I/O score is better: assume 0-100 range
    return Math.min(100, Math.max(0, io));
}

function normalizePopularity(rank: number | undefined): number {
    if (!rank) return 50;
    // Lower rank is better: rank 1 = 100, rank 100 = 0
    const score = Math.max(0, 101 - rank);
    return Math.min(100, score);
}

function normalizeFreshness(lastRelease: string | undefined): number {
    if (!lastRelease) return 50;
    const date = new Date(lastRelease);
    if (isNaN(date.getTime())) return 50;

    const now = new Date();
    const daysSince = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // More recent is better: 0 days = 100, 365+ days = 20
    if (daysSince <= 30) return 100;
    if (daysSince <= 90) return 85;
    if (daysSince <= 180) return 70;
    if (daysSince <= 365) return 55;
    return 30;
}

export function ComparisonRadarChart({ distros }: ComparisonRadarChartProps) {
    if (distros.length === 0) return null;

    // Create data points for each metric
    const metrics = ['RAM', 'CPU', 'I/O', 'Popularidade', 'Atualizações'];

    const data = metrics.map((metric, idx) => {
        const point: Record<string, string | number> = { metric };

        distros.forEach((distro, i) => {
            let value: number;

            switch (idx) {
                case 0: // RAM
                    value = normalizeRAM(distro.idleRamUsage);
                    break;
                case 1: // CPU
                    value = normalizeCPU(distro.cpuScore);
                    break;
                case 2: // I/O
                    value = normalizeIO(distro.ioScore);
                    break;
                case 3: // Popularity
                    value = normalizePopularity(distro.ranking || distro.popularityRank);
                    break;
                case 4: // Freshness
                    value = normalizeFreshness(distro.lastRelease);
                    break;
                default:
                    value = 50;
            }

            point[distro.name] = value;
        });

        return point;
    });

    return (
        <div className="w-full bg-card/50 border border-border rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold text-center mb-4">Resumo Visual</h3>

            <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                        <PolarGrid
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={1}
                        />
                        <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickLine={false}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />

                        {distros.map((distro, index) => (
                            <Radar
                                key={distro.id}
                                name={distro.name}
                                dataKey={distro.name}
                                stroke={COLORS[index % COLORS.length]}
                                fill={FILL_COLORS[index % FILL_COLORS.length]}
                                strokeWidth={2}
                                dot={{ r: 3, fill: COLORS[index % COLORS.length] }}
                            />
                        ))}

                        <Legend
                            wrapperStyle={{ paddingTop: 10 }}
                            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                            labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: 4 }}
                            itemStyle={{ color: '#9ca3af', fontSize: 12 }}
                            formatter={(value: number) => [`${Math.round(value)} pontos`, '']}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Score Summary */}
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border/50">
                {distros.map((distro, index) => {
                    // Calculate average score
                    const ramScore = normalizeRAM(distro.idleRamUsage);
                    const cpuScore = normalizeCPU(distro.cpuScore);
                    const ioScore = normalizeIO(distro.ioScore);
                    const popScore = normalizePopularity(distro.ranking || distro.popularityRank);
                    const freshScore = normalizeFreshness(distro.lastRelease);
                    const avgScore = Math.round((ramScore + cpuScore + ioScore + popScore + freshScore) / 5);

                    return (
                        <div key={distro.id} className="text-center">
                            <div
                                className="text-3xl font-bold"
                                style={{ color: COLORS[index % COLORS.length] }}
                            >
                                {avgScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Pontos</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
