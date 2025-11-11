import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Button from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'

interface RPSFiltersProps {
  onFiltersChange?: (filters: RPSFilterValues) => void
}

export interface RPSFilterValues {
  rps3: { enabled: boolean; min: number; max: number }
  rps5: { enabled: boolean; min: number; max: number }
  rps15: { enabled: boolean; min: number; max: number }
  rps30: { enabled: boolean; min: number; max: number }
  marketCap: number
  listingDays: number
  date: string
}

const RPSFilters: React.FC<RPSFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<RPSFilterValues>({
    rps3: { enabled: true, min: 87, max: 90 },
    rps5: { enabled: true, min: 87, max: 90 },
    rps15: { enabled: false, min: 0, max: 100 },
    rps30: { enabled: false, min: 0, max: 100 },
    marketCap: 80,
    listingDays: 360,
    date: new Date().toISOString().split('T')[0],
  })

  const handleFilterChange = (key: keyof RPSFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleRPSEnable = (
    rpsType: 'rps3' | 'rps5' | 'rps15' | 'rps30',
    enabled: boolean
  ) => {
    const newRange = { ...filters[rpsType], enabled }
    handleFilterChange(rpsType, newRange)
  }

  const RPSRangeInput = ({
    rpsType,
    label,
    value,
  }: {
    rpsType: 'rps3' | 'rps5' | 'rps15' | 'rps30'
    label: string
    value: { enabled: boolean; min: number; max: number }
  }) => {
    const [localMin, setLocalMin] = useState(value.min.toString())
    const [localMax, setLocalMax] = useState(value.max.toString())
    const [error, setError] = useState('')

    const validateInput = (min: string, max: string) => {
      const minNum = parseInt(min)
      const maxNum = parseInt(max)

      if (isNaN(minNum) || isNaN(maxNum)) {
        return '请输入有效数字'
      }

      if (minNum < 0 || minNum > 100 || maxNum < 0 || maxNum > 100) {
        return '数值必须在0-100之间'
      }

      if (minNum >= maxNum) {
        return '最大值必须大于最小值'
      }

      return ''
    }

    const handleConfirm = () => {
      const validationError = validateInput(localMin, localMax)

      if (validationError) {
        setError(validationError)
        return
      }

      setError('')
      const minValue = parseInt(localMin)
      const maxValue = parseInt(localMax)

      const newRange = { ...filters[rpsType], min: minValue, max: maxValue }
      handleFilterChange(rpsType, newRange)
    }

    const handleCancel = () => {
      setLocalMin(value.min.toString())
      setLocalMax(value.max.toString())
      setError('')
    }

    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={value.enabled}
          onCheckedChange={checked => handleRPSEnable(rpsType, !!checked)}
        />
        <Label className="text-sm font-medium">{label}</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={!value.enabled}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
            >
              {value.min}-{value.max}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">设置范围</div>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Label
                    htmlFor={`${rpsType}-min`}
                    className="text-xs text-gray-600"
                  >
                    最小值
                  </Label>
                  <Input
                    id={`${rpsType}-min`}
                    type="number"
                    min="0"
                    max="100"
                    value={localMin}
                    onChange={e => {
                      setLocalMin(e.target.value)
                      setError('')
                    }}
                    className="w-full mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor={`${rpsType}-max`}
                    className="text-xs text-gray-600"
                  >
                    最大值
                  </Label>
                  <Input
                    id={`${rpsType}-max`}
                    type="number"
                    min="0"
                    max="100"
                    value={localMax}
                    onChange={e => {
                      setLocalMax(e.target.value)
                      setError('')
                    }}
                    className="w-full mt-1"
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="text-xs text-gray-500">
                范围: 0-100，最大值需大于最小值
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleConfirm} size="sm" className="flex-1">
                  确认
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const handleConfirm = () => {
    onFiltersChange?.(filters)
  }

  // 移除自动触发，改为手动触发
  // 用户需要点击"确认"按钮才会触发请求

  return (
    <div className="flex flex-col flex-wrap items-stretch gap-4">
      {/* RPS 筛选器 */}
      <div className="flex items-center gap-4">
        <RPSRangeInput rpsType="rps3" label="RPS3" value={filters.rps3} />
        <RPSRangeInput rpsType="rps5" label="RPS5" value={filters.rps5} />
        <RPSRangeInput rpsType="rps15" label="RPS15" value={filters.rps15} />
        <RPSRangeInput rpsType="rps30" label="RPS30" value={filters.rps30} />
      </div>

      {/* 其他筛选器 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">日期</Label>
          <DatePicker
            date={filters.date}
            onDateChange={date => handleFilterChange('date', date)}
            className="w-32"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">流通市值(亿)</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.marketCap || ''}
            onChange={e =>
              handleFilterChange('marketCap', parseFloat(e.target.value) || 0)
            }
            className="w-16 h-7 text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium">上市天数</Label>
          <Input
            type="number"
            placeholder="360"
            value={filters.listingDays || ''}
            onChange={e =>
              handleFilterChange('listingDays', parseInt(e.target.value) || 360)
            }
            className="w-16 h-7 text-sm"
          />
        </div>
        {/*grow=1 表示剩余空间全部占用, 确认显示在右侧*/}
        <div className="flex-1"></div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleConfirm}
          className="active:bg-black active:text-white"
        >
          确认
        </Button>
      </div>
    </div>
  )
}

export default RPSFilters
