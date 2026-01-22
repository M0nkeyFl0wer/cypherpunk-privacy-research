'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAnalyticsSummary, clearTelemetry, exportTelemetry } from '@/lib/telemetry';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAnalytics(getAnalyticsSummary());
  }, []);

  const handleRefresh = () => {
    setAnalytics(getAnalyticsSummary());
  };

  const handleExport = () => {
    const data = exportTelemetry();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all telemetry data? This cannot be undone.')) {
      clearTelemetry();
      setAnalytics(getAnalyticsSummary());
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <p className="text-[#6c7086]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-[#6c7086] hover:text-[#94e2d5] text-sm mb-2 inline-block">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-bold text-[#e0e0e0]">Local Analytics</h1>
            <p className="text-[#a6adc8] mt-2">
              Privacy-respecting telemetry stored in your browser
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#252525] text-[#e0e0e0] rounded-lg hover:bg-[#333] transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[#89b4fa] text-[#000] rounded-lg hover:bg-[#89b4fa]/80 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-[#f38ba8]/20 text-[#f38ba8] rounded-lg hover:bg-[#f38ba8]/30 transition-colors"
            >
              Clear Data
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mb-8 p-4 bg-[#94e2d5]/10 border border-[#94e2d5]/30 rounded-lg">
          <p className="text-sm text-[#94e2d5]">
            <strong>Privacy Note:</strong> All analytics data is stored locally in your browser.
            No data is sent to external servers. Only you can see this information.
          </p>
        </div>

        {analytics && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <div className="text-3xl font-bold text-[#94e2d5]">{analytics.totalPageViews}</div>
                <div className="text-sm text-[#6c7086]">Total Page Views</div>
              </div>
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <div className="text-3xl font-bold text-[#89b4fa]">{analytics.uniquePages}</div>
                <div className="text-sm text-[#6c7086]">Unique Pages</div>
              </div>
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <div className="text-3xl font-bold text-[#f9e2af]">{analytics.totalSessions}</div>
                <div className="text-sm text-[#6c7086]">Sessions</div>
              </div>
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <div className="text-3xl font-bold text-[#cba6f7]">
                  {analytics.totalPageViews > 0
                    ? (analytics.totalPageViews / Math.max(analytics.totalSessions, 1)).toFixed(1)
                    : '0'}
                </div>
                <div className="text-sm text-[#6c7086]">Pages/Session</div>
              </div>
            </div>

            {/* Viewport Breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <h2 className="text-lg font-semibold text-[#e0e0e0] mb-4">Device Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a6adc8]">Desktop</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[#252525] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#94e2d5]"
                          style={{
                            width: `${(analytics.viewportBreakdown.desktop / Math.max(analytics.totalPageViews, 1)) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[#e0e0e0] w-12 text-right">{analytics.viewportBreakdown.desktop}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#a6adc8]">Tablet</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[#252525] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#89b4fa]"
                          style={{
                            width: `${(analytics.viewportBreakdown.tablet / Math.max(analytics.totalPageViews, 1)) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[#e0e0e0] w-12 text-right">{analytics.viewportBreakdown.tablet}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#a6adc8]">Mobile</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[#252525] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#f9e2af]"
                          style={{
                            width: `${(analytics.viewportBreakdown.mobile / Math.max(analytics.totalPageViews, 1)) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[#e0e0e0] w-12 text-right">{analytics.viewportBreakdown.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Pages */}
              <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
                <h2 className="text-lg font-semibold text-[#e0e0e0] mb-4">Top Pages</h2>
                {analytics.topPages.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.topPages.slice(0, 8).map((page, i) => (
                      <div key={page.path} className="flex items-center justify-between text-sm">
                        <span className="text-[#a6adc8] truncate flex-1" title={page.path}>
                          {page.path || '/'}
                        </span>
                        <span className="text-[#e0e0e0] ml-4">{page.views}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6c7086] text-sm">No page views recorded yet</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-[#111] border border-[#252525] rounded-lg">
              <h2 className="text-lg font-semibold text-[#e0e0e0] mb-4">Recent Activity</h2>
              {analytics.recentActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6c7086] text-left">
                        <th className="pb-2 pr-4">Time</th>
                        <th className="pb-2 pr-4">Path</th>
                        <th className="pb-2 pr-4">Device</th>
                        <th className="pb-2">Referrer</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#a6adc8]">
                      {analytics.recentActivity.map((pv, i) => (
                        <tr key={i} className="border-t border-[#252525]">
                          <td className="py-2 pr-4 text-[#6c7086]">
                            {new Date(pv.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2 pr-4 truncate max-w-[200px]" title={pv.path}>
                            {pv.path || '/'}
                          </td>
                          <td className="py-2 pr-4">{pv.viewport}</td>
                          <td className="py-2 text-[#6c7086]">{pv.referrer || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#6c7086] text-sm">No recent activity</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
