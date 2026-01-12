import * as React from 'react'
import { format, parseISO, startOfMonth, isAfter } from 'date-fns'
import type { DayEventHandler } from 'react-day-picker'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import Button from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { fetchTradeDates, TRADE_DATE_BATCH_SIZE } from '@/lib/supabase'
import {
  getCachedHasMore,
  getCachedTradeDates,
  getDefaultTradeDateBefore,
  prefetchTradeDates,
  setTradeDateCache,
} from '@/lib/trade-date-cache'

export interface TradeDateCalendarProps {
  date?: string
  onDateChange?: (value: string) => void
  className?: string
}

const BEIJING_UTC_OFFSET_HOURS = 8
const BEIJING_CUTOFF_MINUTES = 15 * 60

const isBeforeBeijingCutoff = () => {
  const now = new Date()
  const beijingHour = (now.getUTCHours() + BEIJING_UTC_OFFSET_HOURS) % 24
  const totalMinutes = beijingHour * 60 + now.getUTCMinutes()
  return totalMinutes < BEIJING_CUTOFF_MINUTES
}

const pickDefaultTradeDate = (dates: string[]) => {
  if (dates.length === 0) return undefined
  const shouldUsePrevious = isBeforeBeijingCutoff() && dates.length > 1
  return dates[shouldUsePrevious ? 1 : 0]
}

const mergeTradeDates = (current: string[], incoming: string[]) => {
  const merged = Array.from(new Set([...current, ...incoming]))
  return merged.sort((a, b) => (a < b ? 1 : -1))
}

export const TradeDateCalendar = ({
  date,
  onDateChange,
  className,
}: TradeDateCalendarProps) => {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(() => getCachedHasMore())
  const [error, setError] = React.useState<string | null>(null)
  const [tradeDates, setTradeDates] = React.useState<string[]>(() =>
    getCachedTradeDates()
  )
  const tradeDatesRef = React.useRef<string[]>(getCachedTradeDates())
  const hasMoreRef = React.useRef(getCachedHasMore())
  const autoLoadingRef = React.useRef(false)

  const defaultBeforeDate = React.useMemo(getDefaultTradeDateBefore, [])

  const updateHasMore = React.useCallback((value: boolean) => {
    setHasMore(value)
    hasMoreRef.current = value
  }, [])

  const applyTradeDatesUpdate = React.useCallback(
    (incoming: string[], hasMoreValue: boolean) => {
      setTradeDates((prev: string[]) => {
        const merged = mergeTradeDates(prev, incoming)
        tradeDatesRef.current = merged
        setTradeDateCache(merged, hasMoreValue)
        return merged
      })
      updateHasMore(hasMoreValue)
    },
    [updateHasMore]
  )

  const tradeDateSet = React.useMemo(() => new Set(tradeDates), [tradeDates])
  const selectedDate = date ? parseISO(date) : undefined
  const defaultMonth = React.useMemo(() => {
    if (selectedDate) return selectedDate
    if (tradeDates.length > 0) return parseISO(tradeDates[0])
    return undefined
  }, [selectedDate, tradeDates])
  const triggerLabel = React.useMemo(() => {
    if (loading || loadingMore) return '加载中...'
    if (error && tradeDates.length === 0) return '加载失败，点此重试'
    return date || '选择交易日'
  }, [date, error, loading, loadingMore, tradeDates.length])

  const loadTradeDates = React.useCallback(
    async (beforeDate?: string) => {
      const isLoadMore = Boolean(beforeDate)
      setError(null)
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      try {
        const dates = await fetchTradeDates({
          beforeDate: beforeDate ?? defaultBeforeDate,
          limit: TRADE_DATE_BATCH_SIZE,
        })

        const noMore =
          dates.length < TRADE_DATE_BATCH_SIZE ||
          (isLoadMore && dates.length === 0)

        applyTradeDatesUpdate(dates, !noMore)

        if (!isLoadMore && !date && dates.length > 0) {
          const defaultDate = pickDefaultTradeDate(dates)
          if (defaultDate) {
            onDateChange?.(defaultDate)
          }
        }

        return dates
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '加载交易日失败，请稍后重试'
        setError(message)
        return []
      } finally {
        if (isLoadMore) {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
      }
    },
    [applyTradeDatesUpdate, defaultBeforeDate]
  )

  const handleTriggerClick = React.useCallback(() => {
    if (tradeDatesRef.current.length === 0 && !loading && !loadingMore) {
      void loadTradeDates()
    }
  }, [loadTradeDates, loading, loadingMore])

  React.useEffect(() => {
    let canceled = false

    prefetchTradeDates(defaultBeforeDate, TRADE_DATE_BATCH_SIZE)
      .then(({ dates, hasMore }) => {
        if (canceled) return
        applyTradeDatesUpdate(dates, hasMore)
        if (!date && dates.length > 0) {
          const defaultDate = pickDefaultTradeDate(dates)
          if (defaultDate) {
            onDateChange?.(defaultDate)
          }
        }
      })
      .catch(err => {
        if (canceled) return
        const message =
          err instanceof Error ? err.message : '加载交易日失败，请稍后重试'
        setError(message)
      })

    return () => {
      canceled = true
    }
  }, [applyTradeDatesUpdate, date, defaultBeforeDate, onDateChange])

  React.useEffect(() => {
    if (!open) return
    if (tradeDatesRef.current.length > 0) return
    if (loading || loadingMore) return

    void loadTradeDates()
  }, [loadTradeDates, loading, loadingMore, open])

  const handleDayClick: DayEventHandler<React.MouseEvent> = (
    day
    // _modifiers,
    // _event
  ) => {
    const dayString = format(day, 'yyyy-MM-dd')

    if (!tradeDateSet.has(dayString)) {
      setError('只能选择已加载的交易日，请加载更多日期后再试')
      return
    }

    setError(null)
    onDateChange?.(dayString)
    setOpen(false)
  }

  const handleLoadMore = async () => {
    const oldestLoaded = tradeDates[tradeDates.length - 1]
    await loadTradeDates(oldestLoaded)
  }

  const handleMonthChange = React.useCallback(
    async (month: Date) => {
      if (
        autoLoadingRef.current ||
        !hasMoreRef.current ||
        tradeDatesRef.current.length === 0
      ) {
        return
      }

      const targetMonthStart = startOfMonth(month)
      let oldestLoaded = tradeDatesRef.current[tradeDatesRef.current.length - 1]
      let oldestMonthStart = oldestLoaded
        ? startOfMonth(parseISO(oldestLoaded))
        : null

      if (!oldestMonthStart || !isAfter(oldestMonthStart, targetMonthStart)) {
        return
      }

      autoLoadingRef.current = true
      try {
        while (
          hasMoreRef.current &&
          oldestMonthStart &&
          isAfter(oldestMonthStart, targetMonthStart)
        ) {
          await loadTradeDates(oldestLoaded)
          oldestLoaded = tradeDatesRef.current[tradeDatesRef.current.length - 1]
          oldestMonthStart = oldestLoaded
            ? startOfMonth(parseISO(oldestLoaded))
            : null
        }
      } finally {
        autoLoadingRef.current = false
      }
    },
    [loadTradeDates]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-40 justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          onClick={handleTriggerClick}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>交易日历</span>
            {loading && (
              <span className="flex items-center text-xs text-muted-foreground">
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                加载中
              </span>
            )}
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={defaultMonth}
            onDayClick={handleDayClick}
            disabled={day => !tradeDateSet.has(format(day, 'yyyy-MM-dd'))}
            captionLayout="dropdown"
            onMonthChange={handleMonthChange}
            className="rounded-md border"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              仅可选择 Supabase 返回的交易日
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              disabled={
                loading || loadingMore || (!hasMore && tradeDates.length > 0)
              }
            >
              {(loading || loadingMore) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tradeDates.length === 0
                ? '加载交易日'
                : hasMore
                  ? '加载更早日期'
                  : '无更多日期'}
            </Button>
          </div>
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TradeDateCalendar
