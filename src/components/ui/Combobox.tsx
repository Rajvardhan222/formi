"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "short_answer",
    label: "Short Answer",
  },
  {
    value: "long_answer",
    label: "Long Answer",
  },
  {
    value: "multiple_choice",
    label: "Multiple Choice",
  },
  {
    value: "checkbox",
    label: "Checkbox",
  },
  {
    value: "dropdown",
    label: "Dropdown",
  },
]

export function ExampleCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("short_answer")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select type..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 text-gray-500 dark:text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
        <Command className="bg-white dark:bg-gray-900">
          <CommandInput 
            placeholder="Search type..." 
            className="text-black dark:text-white bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
          />
          <CommandList className="bg-white dark:bg-gray-900">
            <CommandEmpty className="text-gray-500 dark:text-gray-400">No type found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4 text-green-600 dark:text-green-400",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ExampleCombobox
export { ExampleCombobox as Combobox }