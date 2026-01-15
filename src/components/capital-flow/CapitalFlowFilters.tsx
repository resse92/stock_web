import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button'
import TradeDateCalendar from '@/components/ui/trade-date-calendar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'

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
  const [filtersBeforeOpen, setFiltersBeforeOpen] =
    useState<CapitalFlowFilterValues>(filters)
  const [open, setOpen] = useState(false)
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
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFiltersBeforeOpen(filters)
    } else {
      if (!isSameFilters(filters, filtersBeforeOpen)) {
        setFilters(filtersBeforeOpen)
      }
    }
    setOpen(isOpen)
  }

  const handleDaysClick = (days: number) => {
    const newFilters = { ...filters, days }
    setFilters(newFilters)
  }

  const hasChanges = !isSameFilters(filters, lastSubmittedFilters)

  const dayOptions = [1, 3, 5]

  return (
    <div className="flex gap-3 items-center">
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">日期</Label>
        <TradeDateCalendar
          date={filters.date}
          onDateChange={handleDateChange}
        />
      </div>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>资金流向筛选</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>天数</Label>
              <div className="flex gap-2">
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
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="custom-days">自定义天数</Label>
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

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              onClick={handleQueryClick}
              disabled={!filters.date || !hasChanges}
            >
              查询
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default CapitalFlowFilters
