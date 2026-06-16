import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const label =
    theme === "light" ? "Light · ნათელი" : theme === "dark" ? "Dark · მუქი" : "System · სისტემური";
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggle}
      aria-label={`Theme: ${label}. Click to switch.`}
      title={label}
      className="relative"
    >
      {theme === "light" && <Sun className="w-5 h-5 text-foreground" />}
      {theme === "dark" && <Moon className="w-5 h-5 text-foreground" />}
      {theme === "system" && <Laptop className="w-5 h-5 text-foreground" />}
    </Button>
  );
}
