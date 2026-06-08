import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from './use-theme';
import type { Theme } from './theme-context';

const options: Array<{ value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: 'light', label: 'Sáng', icon: FiSun },
  { value: 'dark', label: 'Tối', icon: FiMoon },
  { value: 'system', label: 'Hệ thống', icon: FiMonitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm" aria-label="Chọn giao diện">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            title={option.label}
            aria-label={`Giao diện ${option.label}`}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
