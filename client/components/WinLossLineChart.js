import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default class WinLossLineChart extends PureComponent {
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
        <LineChart
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
          <Line type='monotone' dataKey='T' stroke='#FD0100' />
          <Line type='monotone' dataKey='K' stroke='#F76915' />
          <Line type='monotone' dataKey='E' stroke='#EEDE04' />
          <Line type='monotone' dataKey='S' stroke='#A0D636' />
          <Line type='monotone' dataKey='B' stroke='#2FA236' />
          <Line type='monotone' dataKey='A' stroke='#333ED4' />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
