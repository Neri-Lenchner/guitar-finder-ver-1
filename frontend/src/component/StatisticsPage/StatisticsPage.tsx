import { JSX, useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { statisticService, IGuitarStats } from '../../services/statistic.service';
import { IBrand } from '../../models/guitar.model';
import guitarsData from '../../data/guitars.json';
import guitarGod from '../../assets/guitar-god.png';
import Spinner from '../Spinner/Spinner';
import './StatisticsPage.css';

const glowPlugin = {
    id: 'glowEffect',
    beforeDatasetDraw(chart: any, args: any) {
        const bg = chart.data.datasets[args.index].backgroundColor;
        const color = Array.isArray(bg) ? 'rgba(255,255,255,0.18)' : bg;
        chart.ctx.save();
        chart.ctx.shadowBlur = 14;
        chart.ctx.shadowColor = color;
    },
    afterDatasetDraw(chart: any) {
        chart.ctx.restore();
    },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, glowPlugin);

const brands: IBrand[] = guitarsData as IBrand[];

const COLORS = [
    '#16a34a', '#60a5fa', '#facc15', '#a78bfa',
    '#f472b6', '#fb923c', '#34d399', '#f87171',
    '#38bdf8', '#c084fc', '#4ade80', '#fbbf24',
];

const darkChartOptions = (title: string) => ({
    responsive: true,
    plugins: {
        legend: { labels: { color: '#e8e8f0' } },
        title: { display: true, text: title, color: '#e8e8f0', font: { size: 14 as const } },
    },
    scales: {
        x: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
});

function StatisticsPage(): JSX.Element {
    const [stats, setStats] = useState<IGuitarStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [ingesting, setIngesting] = useState(false);
    const [ingestMsg, setIngestMsg] = useState('');

    useEffect(() => {
        statisticService.getStats()
            .then(setStats)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    async function handleIngest(): Promise<void> {
        setIngesting(true);
        setIngestMsg('');
        try {
            const payload = brands.map(b => ({ brand: b.name, models: b.models.map(m => m.name) }));
            await statisticService.ingest(payload);
            const fresh = await statisticService.getStats();
            setStats(fresh);
            setIngestMsg('Data updated successfully.');
        } catch {
            setIngestMsg('Update failed. Make sure the Reverb token is configured.');
        } finally {
            setIngesting(false);
        }
    }

    if (loading) return (
        <div className="stats-page">
            <img src={guitarGod} className="stats-bg-guitar" alt="" />
            <Spinner text="Loading statistics..." />
        </div>
    );

    const overallAvg = stats && stats.byBrand.length
        ? Math.round(stats.byBrand.reduce((s, b) => s + b.avgPrice, 0) / stats.byBrand.length)
        : 0;

    return (
        <div className="stats-page">
            <img src={guitarGod} className="stats-bg-guitar" alt="" />
            <div className="stats-inner">
                <div className="stats-header">
                    <div>
                        <h1 className="stats-title">Market <span>Statistics</span></h1>
                        <p className="stats-subtitle">Live guitar market data powered by Reverb</p>
                        {stats?.lastUpdated && (
                            <p className="stats-last-updated">Last updated: {new Date(stats.lastUpdated).toLocaleString()}</p>
                        )}
                    </div>
                    <button className="stats-ingest-btn" onClick={handleIngest} disabled={ingesting}>
                        {ingesting ? 'Updating...' : 'Update Data'}
                    </button>
                </div>

                {ingestMsg && <p className="stats-ingest-msg">{ingestMsg}</p>}

                {!stats || stats.totalListings === 0 ? (
                    <div className="stats-empty">
                        <p>No data yet. Click <strong>Update Data</strong> to fetch listings from Reverb.</p>
                        <p className="stats-empty-note">This may take a minute as it queries all 25 brands.</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-cards">
                            <div className="stats-card">
                                <span className="stats-card-value">{stats.totalListings.toLocaleString()}</span>
                                <span className="stats-card-label">Total Listings</span>
                            </div>
                            <div className="stats-card">
                                <span className="stats-card-value">{stats.byBrand.length}</span>
                                <span className="stats-card-label">Brands Tracked</span>
                            </div>
                            <div className="stats-card">
                                <span className="stats-card-value">${overallAvg.toLocaleString()}</span>
                                <span className="stats-card-label">Overall Avg Price</span>
                            </div>
                            <div className="stats-card">
                                <span className="stats-card-value">{stats.byCondition.length}</span>
                                <span className="stats-card-label">Condition Types</span>
                            </div>
                        </div>

                        <div className="stats-charts-row">
                            <div className="stats-chart-box">
                                <Bar
                                    data={{
                                        labels: stats.byBrand.slice(0, 10).map(b => b.brand),
                                        datasets: [{
                                            label: 'Avg Price (USD)',
                                            data: stats.byBrand.slice(0, 10).map(b => b.avgPrice),
                                            backgroundColor: COLORS,
                                        }],
                                    }}
                                    options={darkChartOptions('Average Price by Brand (Top 10)')}
                                />
                            </div>
                            <div className="stats-chart-box stats-chart-doughnut">
                                <Doughnut
                                    data={{
                                        labels: stats.topModels.slice(0, 10).map(m => `${m.brand} ${m.model || ''}`.trim()),
                                        datasets: [{
                                            data: stats.topModels.slice(0, 10).map(m => m.count),
                                            backgroundColor: COLORS,
                                            borderColor: 'rgba(0,0,0,0.3)',
                                            borderWidth: 1,
                                        }],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: { position: 'bottom', labels: { color: '#e8e8f0', boxWidth: 12 } },
                                            title: { display: true, text: 'Top Sold Guitar Models', color: '#e8e8f0', font: { size: 14 } },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="stats-charts-row">
                            <div className="stats-chart-box">
                                <Bar
                                    data={{
                                        labels: stats.priceHistogram.map(b => b.range),
                                        datasets: [{
                                            label: 'Number of Listings',
                                            data: stats.priceHistogram.map(b => b.count),
                                            backgroundColor: '#16a34a',
                                        }],
                                    }}
                                    options={darkChartOptions('Price Distribution')}
                                />
                            </div>
                            <div className="stats-chart-box stats-models-table-box">
                                <h3 className="stats-table-title">Top Sold Guitar Models</h3>
                                <table className="stats-models-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Brand</th>
                                            <th>Model</th>
                                            <th>Listings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.topModels.slice(0, 10).map((m, i) => (
                                            <tr key={i}>
                                                <td className="stats-table-rank">{i + 1}</td>
                                                <td>{m.brand}</td>
                                                <td>{m.model || '—'}</td>
                                                <td className="stats-table-count">{m.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="stats-charts-row stats-charts-row--full">
                            <div className="stats-chart-box">
                                <Bar
                                    data={{
                                        labels: stats.byBrand.map(b => b.brand),
                                        datasets: [{
                                            label: 'Listings Count',
                                            data: stats.byBrand.map(b => b.count),
                                            backgroundColor: COLORS,
                                        }],
                                    }}
                                    options={darkChartOptions('Total Listings by Brand')}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default StatisticsPage;
