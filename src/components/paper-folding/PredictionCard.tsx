import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SectionCard } from '../SectionCard';
import { appStyles } from '../../styles/appStyles';
import { cn } from '../../lib/cn';

type FeedbackState = {
  type: 'success' | 'error' | null;
  message: string;
};

type PredictionCardProps = {
  n: number;
  prediction: string;
  feedback: FeedbackState;
  onPredictionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function PredictionCard({
  n,
  prediction,
  feedback,
  onPredictionChange,
  onSubmit,
}: PredictionCardProps) {
  return (
    <SectionCard className="space-y-4 p-6">
      <h2 className="text-sm font-semibold text-gray-700">Specializing: Predict the Next Step</h2>
      <p className="text-xs text-gray-500">
        How many total creases will there be after <span className="font-bold text-black">{n + 1}</span> folds?
      </p>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="number"
          value={prediction}
          onChange={(e) => onPredictionChange(e.target.value)}
          placeholder="Your guess..."
          className={appStyles.input}
        />
        <button
          type="submit"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          Check
        </button>
      </form>

      <AnimatePresence mode="wait">
        {feedback.type && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn(
              'flex items-start gap-2 rounded-lg p-3 text-xs',
              feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
            )}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={14} className="mt-0.5" />
            ) : (
              <AlertCircle size={14} className="mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  );
}
