import React from 'react';
import { motion } from 'motion/react';
import { SectionCard } from '../SectionCard';
import { SectionHeader } from '../SectionHeader';
import { appStyles } from '../../styles/appStyles';

type HistoryRow = {
  n: number;
  newCreases: number;
  totalCreases: number;
  segments: number;
};

type HistoryTableProps = {
  history: HistoryRow[];
};

export function HistoryTable({ history }: HistoryTableProps) {
  return (
    <SectionCard className="overflow-hidden">
      <SectionHeader title="Data Log" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={appStyles.tableHead}>
			<th className="table-header px-6 py-3 text-s text-gray-600 tracking-wide">Folds (n)</th>
			<th className="table-header px-6 py-3 text-s text-gray-600 tracking-wide">New Creases</th>
			<th className="table-header px-6 py-3 text-s text-gray-600 tracking-wide">Total Creases (C)</th>
			<th className="table-header px-6 py-3 text-s text-gray-600 tracking-wide">Total Segments (S)</th>            
		</tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {history.map((row) => (
              <motion.tr
                key={row.n}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="transition-colors hover:bg-gray-50"
              >
			<td className={appStyles.tableBodyCell1}>{row.n}</td>
			<td className={appStyles.tableBodyCell1}>{row.newCreases}</td>
			<td className={appStyles.tableBodyCell2}>{row.totalCreases}</td>
			<td className={appStyles.tableBodyCell1}>{row.segments}</td>             
	 </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
