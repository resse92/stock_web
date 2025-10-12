import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { useSidebarZustand } from '@/contexts/SidebarContextZustand';
import { RPSFiltersComponent } from './RPSFilters';
import { RPSTable } from './RPSTable';
import { stockApi } from '@/lib/api';
import type { RPSData, RPSFilters } from '@/types/stock';
import { RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';

export const RPSPage: React.FC = () => {
  const { isCollapsed } = useSidebarZustand();
  const [data, setData] = useState<RPSData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RPSFilters>({
    sortBy: 'rps',
    sortOrder: 'desc',
  });
  const [appliedFilters, setAppliedFilters] = useState<RPSFilters>(filters);

  const fetchRPSData = useCallback(async (filterParams: RPSFilters) => {
    setLoading(true);
    try {
      const result = await stockApi.getRPS(filterParams);
      setData(result);
    } catch (error) {
      console.error('Error fetching RPS data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRPSData(appliedFilters);
  }, [fetchRPSData, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const defaultFilters: RPSFilters = {
      sortBy: 'rps',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleRefresh = () => {
    fetchRPSData(appliedFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                RPS 相对强度排名
              </h2>
              <p className="text-muted-foreground">
                根据相对价格强度 (Relative Price Strength) 筛选和排序股票
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>

          <RPSFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          <RPSTable data={data} loading={loading} />
        </main>
      </div>
    </div>
  );
};
