import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default class SuccessRateBarChart extends PureComponent {
  render() {
    const { data } = this.props;
    if (!data.length) return <div>Chart Loading...</div>;

    return (
      <ResponsiveContainer
        width='100%'
        minWidth='500px'
        height='100%'
        minHeight='300px'
        maxHeight='350px'
      >
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='successRate' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
