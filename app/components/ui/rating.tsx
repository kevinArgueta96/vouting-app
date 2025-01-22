import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "../../lib/utils"

const ratingLabels: Record<number, string> = {
  1: "Regular",
  2: "Bueno",
  3: "Muy Bueno",
  4: "Excelente",
  5: "Excepcional"
}

interface RatingProps {
  className?: string
  id?: string
  value: number
  onChange?: (value: number) => void
  max?: number
  disabled?: boolean
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value, onChange, max = 5, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex gap-2", className)}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              "group relative rounded-md p-1.5 transition-all duration-200 hover:scale-110",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "cursor-pointer"
            )}
            disabled={disabled}
            onClick={() => onChange?.(index + 1)}
            aria-label={`Rate ${index + 1} out of ${max} stars`}
          >
            <>
              <Star
                className={cn(
                  "h-8 w-8 transition-all duration-200",
                  index < value 
                    ? "fill-primary text-primary" 
                    : "fill-none text-muted-foreground group-hover:text-primary/70"
                )}
              />
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {ratingLabels[index + 1]}
              </span>
            </>
          </button>
        ))}
      </div>
    )
  }
)
Rating.displayName = "Rating"

export { Rating }
