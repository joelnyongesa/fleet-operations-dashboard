import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { data } from '../utils/data';

function LineChartTemplate() {
  return (
    <div className="px-5 pt-2 pb-5">
        {/* Chart Content */}
        <div className="flex items-start">
            <div className="text-sm text-slate-800 mr-2 w-full">
                <div className="flex flex-wrap justify-between items-end mb-4">
                    <div className="flex items-center justify-center">
                        <div className="text-3xl font-bold text-emerald-400 mr-2">
                            5 Days Trip Summary
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                            <div className="bg-slate-100 text-xs inline-flex font-semibold text-slate-500 rounded-full text-center px-2 5 py-1">50 Trips</div>
                            <div className="bg-slate-100 text-xs inline-flex font-semibold text-slate-500 rounded-full text-center px-2.5 py-1">5 Days</div>
                        </div>
                    </div>
                </div>
                <div className="grow h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                wrapperClassName="text-sm bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-700 p-2" 
                                contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                                labelStyle={{ fontWeight: 'bold', color: '#334155' }} 
                                itemStyle={{ color: '#334155' }}
                                />
                            <Legend />
                            <Line dataKey="trips" stroke='#34d399' strokeWidth={2} type="monotone" dot={false} activeDot={{ r: 5, strokeWidth: 1, fill: '#000' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default LineChartTemplate