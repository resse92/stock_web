import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DatePickerProps {
  date?: string
  onDateChange?: (date: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = '选择日期',
  className,
}: DatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange?.(e.target.value)
  }

  return (
    <div className={cn('relative', className)}>
      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      <input
        type="date"
        value={date || ''}
        onChange={handleDateChange}
        className={cn(
          'w-full h-9 pl-10 pr-3 rounded-md border border-input bg-background text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          !date && 'text-muted-foreground'
        )}
        placeholder={placeholder}
      />
    </div>
  )
}
