import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/button'

export function UpgradeCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-3.5 text-foreground" />
          <span className="text-xs font-medium text-foreground">Square UI</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Collection of beautifully crafted open-source layouts UI built with
          shadcn/ui.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-full justify-center gap-1.5 text-xs"
          asChild
        ></Button>
      </div>
    </div>
  )
}
