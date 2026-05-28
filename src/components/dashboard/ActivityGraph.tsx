"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatShort } from "@/lib/utils/formatDate";
import type { ActivityDay } from "@/types/app.types";

interface ActivityGraphProps {
  data: ActivityDay[];
}

export function ActivityGraph({ data }: ActivityGraphProps) {
  const [days, setDays] = useState<7 | 30>(30);

  const sliced = data.slice(-days).map((d) => ({
    ...d,
    day: formatShort(d.day),
  }));

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base-content">Activity</h2>
          <div className="join">
            <button
              className={`join-item btn btn-xs ${days === 7 ? "btn-active" : "btn-ghost"}`}
              onClick={() => setDays(7)}
            >
              7 days
            </button>
            <button
              className={`join-item btn btn-xs ${days === 30 ? "btn-active" : "btn-ghost"}`}
              onClick={() => setDays(30)}
            >
              30 days
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={sliced} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              tickLine={false}
              interval={days === 30 ? 4 : 0}
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--b1))",
                border: "1px solid oklch(var(--b3))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="tasks_completed" name="Tasks done" fill="oklch(var(--p))" radius={[2, 2, 0, 0]} />
            <Bar dataKey="focus_minutes" name="Focus (min)" fill="oklch(var(--s))" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
