import { Input, InputProps } from "@/components/ui/input"
import React from "react"

interface InputFieldType extends InputProps {}

const InputField = React.forwardRef<HTMLInputElement, InputFieldType>(
  ({
    placeholder,
    type = 'text',
    ...componentProps
  }: InputFieldType,
  ref
  ) => {
    return (
      <Input
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...componentProps}
      />
    )
  }
)

export { InputField }