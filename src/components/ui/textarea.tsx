import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const [characterLength, setCharacterLength] = React.useState(props.disabled ? props.value?.toString()?.length ?? 0 : 0)
    const onChangeOverload = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharacterLength(e.target.value.length)
      if (props.onChange) props.onChange(e)
    }
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md resize-y max-h-96 border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
          onChange={onChangeOverload}
        />
        {props.maxLength && (
          <span className="absolute bottom-[6px] right-[6px] text-[10px] text-slate-500">
            {characterLength}/{props.maxLength}
          </span>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
