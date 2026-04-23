"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Transaction } from "@/lib/simClient";
import { formatTimestamp } from "@/lib/formatters";

interface FlowGraphProps {
  transactions: Transaction[];
  title?: string;
}

export function FlowGraph({ transactions, title = "PUSD Flow" }: FlowGraphProps) {
  const hourlyData: Record<string, { hour: string; volume: number; count: number }> = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp * 1000);
    const hourKey = date.toLocaleString("en-US", { hour: "numeric", hour12: true });
    
    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = { hour: hourKey, volume: 0, count: 0 };
    }
    hourlyData[hourKey].volume += tx.amount;
    hourlyData[hourKey].count += 1;
  });

  const chartData = Object.values(hourlyData).slice(0, 24);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D1B2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D1B2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              stroke="#94A3B8"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#94A3B8"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Volume"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#00D1B2" 
              fill="url(#volumeGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ActivityHeatmapProps {
  transactions: Transaction[];
  title?: string;
}

export function ActivityHeatmap({ transactions, title = "Activity Heatmap" }: ActivityHeatmapProps) {
  const dayHourData: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));
  
  transactions.forEach((tx) => {
    const date = new Date(tx.timestamp * 1000);
    const day = date.getDay();
    const hour = date.getHours();
    dayHourData[day][hour] += tx.amount;
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxValue = Math.max(...dayHourData.flat());

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="grid gap-1" style={{ gridTemplateColumns: `40px repeat(24, 1fr)` }}>
        <div></div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-[8px] text-slate-400 text-center">
            {i}
          </div>
        ))}
        
        {days.map((day, dayIndex) => (
          <>
            <div key={`day-${dayIndex}`} className="text-xs text-slate-500 flex items-center">
              {day}
            </div>
            {dayHourData[dayIndex].map((value, hourIndex) => {
              const intensity = maxValue > 0 ? value / maxValue : 0;
              return (
                <div
                  key={`${dayIndex}-${hourIndex}`}
                  className="h-6 rounded-sm transition-colors"
                  style={{
                    backgroundColor: intensity > 0 
                      ? `rgba(0, 209, 178, ${0.2 + intensity * 0.8})`
                      : "#F1F5F9",
                  }}
                  title={`${day} ${hourIndex}:00 - $${value.toFixed(2)}`}
                />
              );
            })}
          </>
        ))}
      </div>
      <div className="flex items-center justify-end mt-4 gap-2 text-xs text-slate-500">
        <span>Low</span>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
            <div
              key={intensity}
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: `rgba(0, 209, 178, ${intensity})`,
              }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}