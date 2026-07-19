import { ProgressBar } from '@/components/ui/ProgressBar';

export interface QuestionProgressBarProps {
  current: number; // 1-based index of the question on screen
  total: number;
}

export function QuestionProgressBar({ current, total }: QuestionProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-caption text-ink-secondary">
        <span className="font-mono">Question {current} of {total}</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <ProgressBar value={percent} />
    </div>
  );
}
