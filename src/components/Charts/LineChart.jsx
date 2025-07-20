import {
  LineChart as _LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const LineChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Monthly Attendance Rate</h2>
      <ResponsiveContainer width="100%" height={300}>
        <_LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={v => `${v}%`} />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
        </_LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
