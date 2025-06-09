import {
  LineChart as _LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 700 },
];

const LineChart = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Monthly Growth</h2>
      <ResponsiveContainer width="100%" height={300}>
        <_LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
        </_LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
