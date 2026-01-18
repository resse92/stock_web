import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button'
import TradeDateCalendar from '@/components/ui/trade-date-calendar'

interface CapitalFlowFiltersProps {
  onFiltersChange?: (filters: CapitalFlowFilterValues) => void
}

export interface CapitalFlowFilterValues {
  date: string
  days: number
}

const CapitalFlowFilters: React.FC<CapitalFlowFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState<CapitalFlowFilterValues>({
    date: '',
    days: 1,
  })
  const [lastSubmittedFilters, setLastSubmittedFilters] =
    useState<CapitalFlowFilterValues | null>(null)

  const isSameFilters = (
    a: CapitalFlowFilterValues | null,
    b: CapitalFlowFilterValues | null
  ) => {
    if (!a || !b) return false
    return a.date === b.date && a.days === b.days
  }

  const handleFilterChange = (
    key: keyof CapitalFlowFilterValues,
    value: unknown
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleDateChange = async (date: string) => {
    const newFilters = { ...filters, date }
    setFilters(newFilters)
    if (onFiltersChange) {
      await onFiltersChange(newFilters)
      setLastSubmittedFilters(newFilters)
    }
  }

  const handleQueryClick = () => {
    if (onFiltersChange && filters.date) {
      onFiltersChange(filters)
      setLastSubmittedFilters(filters)
    }
  }

  const handleDaysClick = (days: number) => {
    const newFilters = { ...filters, days }
    setFilters(newFilters)
    // 如果已选择日期，直接触发查询以提升多日筛选效率
    if (onFiltersChange && filters.date) {
      onFiltersChange(newFilters)
      setLastSubmittedFilters(newFilters)
    }
  }

  const hasChanges = !isSameFilters(filters, lastSubmittedFilters)

  const dayOptions = [1, 3, 5, 10]

  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">日期</Label>
        <TradeDateCalendar
          date={filters.date}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="flex items-center space-x-3">
        <Label className="text-sm font-medium">天数</Label>
        <div className="flex items-center gap-2">
          {dayOptions.map(day => (
            <Button
              key={day}
              variant={filters.days === day ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDaysClick(day)}
            >
              {day}天
            </Button>
          ))}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="custom-days"
              className="text-sm text-muted-foreground"
            >
              自定义
            </Label>
            <Input
              id="custom-days"
              type="number"
              min="1"
              value={filters.days}
              onChange={e =>
                handleFilterChange(
                  'days',
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              }
              className="w-20"
            />
          </div>
        </div>
      </div>

      <Button
        size="sm"
        onClick={handleQueryClick}
        disabled={!filters.date || !hasChanges}
      >
        查询
      </Button>
    </div>
  )
}

export default CapitalFlowFilters
