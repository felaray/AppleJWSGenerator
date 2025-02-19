"use client";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, type LocaleKey } from "@/i18n/locales"
import { Globe } from "lucide-react"

interface LocaleSwitcherProps {
  currentLocale: LocaleKey;
  onLocaleChange: (locale: LocaleKey) => void;
}

export function LocaleSwitcher({ currentLocale, onLocaleChange }: LocaleSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(locales) as [LocaleKey, string][]).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onLocaleChange(key)}
            className={currentLocale === key ? "font-bold" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
