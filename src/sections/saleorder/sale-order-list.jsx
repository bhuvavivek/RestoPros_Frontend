import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import SaleOrderItem from './sale-order-item';
import SaleOrderTimer from './sale-order-timer';

export default function SaleOrderList({ sale }) {
  const [progress, setProgress] = useState({
    total: sale.orderList.length,
    completed: [],
  });

  const [progressPercentage, setProgressPercentage] = useState();
  useEffect(() => {
    setProgressPercentage(Math.round((progress.completed.length / progress.total) * 100));
  }, [progress]);

  return (
    <Card>
      <CardContent>
        <Stack justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{sale?.order_no}</Typography>
          <SaleOrderTimer startTime={sale?.createdAt} />
        </Stack>
        <Typography variant="body1" style={{ marginTop: '4px' }}>
          {sale?.type}
        </Typography>
        {/* <LinearProgress
          variant="determinate"
          value={progressPercentage}
          style={{ marginTop: '4px' }}
        /> */}

        <Typography
          key={sale?.table?.id}
          variant="body1"
          color="textSecondary"
          style={{ marginTop: '4px' }}
        >
          {sale?.table?.table_no}
        </Typography>
        <Typography
          key={sale?.table?.id}
          variant="body1"
          color="textSecondary"
          style={{ marginTop: '4px' }}
        >
          {sale?.table?.name}
        </Typography>

        {/* <Typography variant="body2" color="textSecondary">{`${progressPercentage}%`}</Typography> */}

        {sale.orderList.map((order) => (
          <SaleOrderItem
            order={order}
            setProgress={setProgress}
            key={order?._id}
            totalOrders={sale?.orderList?.length}
          />
        ))}
      </CardContent>
    </Card>
  );
}

SaleOrderList.propTypes = {
  sale: PropTypes.object,
};
