import { Icons } from "../icons"
import * as CheckboxComponent from "@radix-ui/react-checkbox"
import { CheckboxProps as CheckboxComponentProps } from "@radix-ui/react-checkbox"
import { InputHTMLAttributes } from "react"

type CheckboxInputProps = InputHTMLAttributes<HTMLDivElement> &
  CheckboxComponentProps

interface CheckboxProps extends CheckboxInputProps {
  label: string
  name: string
}

const Checkbox = ({ label, name, checked, ...props }: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <CheckboxComponent.Root
        {...props}
        checked={checked}
        className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center rounded-[1.5px] border-2 border-solid border-tuatara-200 bg-transparent duration-100 ease-in aria-checked:border-black aria-checked:bg-black dark:border-anakiwa-800"
        id={name}
      >
        <CheckboxComponent.Indicator className="text-white">
          <Icons.check className="h-3 " />
        </CheckboxComponent.Indicator>
      </CheckboxComponent.Root>
      {label && (
        <label
          className="cursor-pointer break-all pl-3 font-sans text-base font-normal"
          htmlFor={name}
        >
          {label}
        </label>
      )}
    </div>
  )
}
Checkbox.displayName = "Checkbox"

export { Checkbox }
