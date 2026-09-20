import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
  help?: string
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
  help,
}: Props) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className={suffix ? 'pr-14' : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-ink-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {help ? <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{help}</p> : null}
    </div>
  )
}
