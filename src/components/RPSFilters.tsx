import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { RPSFilters } from '@/types/stock';

interface RPSFiltersProps {
  filters: RPSFilters;
  onFiltersChange: (filters: RPSFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export const RPSFiltersComponent: React.FC<RPSFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
}) => {
  const handleChange = (key: keyof RPSFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RPS Range */}
          <div>
            <label className="block text-sm font-medium mb-2">最小 RPS</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="0"
              value={filters.minRPS || ''}
              onChange={(e) => handleChange('minRPS', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">最大 RPS</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="100"
              value={filters.maxRPS || ''}
              onChange={(e) => handleChange('maxRPS', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">最小价格</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">最大价格</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder=""
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium mb-2">最小成交量</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="0"
              value={filters.minVolume || ''}
              onChange={(e) => handleChange('minVolume', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium mb-2">行业</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={filters.sector || ''}
              onChange={(e) => handleChange('sector', e.target.value)}
            >
              <option value="">全部</option>
              <option value="technology">科技</option>
              <option value="finance">金融</option>
              <option value="healthcare">医疗</option>
              <option value="consumer">消费</option>
              <option value="industrial">工业</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2">排序字段</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={filters.sortBy || 'rps'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
            >
              <option value="rps">RPS</option>
              <option value="rps_50">RPS 50</option>
              <option value="rps_120">RPS 120</option>
              <option value="rps_250">RPS 250</option>
              <option value="price">价格</option>
              <option value="volume">成交量</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium mb-2">排序方式</label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleChange('sortOrder', e.target.value)}
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={onApply} className="flex-1">
            应用筛选
          </Button>
          <Button onClick={onReset} variant="outline" className="flex-1">
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
