import { useState } from 'react';
import PropTypes from 'prop-types';

import { Card, Typography, CardContent, LinearProgress } from "@mui/material";

import SaleOrderItem from "./sale-order-item";

export default function SaleOrderList({ sale }) {

  const [progress, setProgress] = useState({
    total: sale.orderList.length,
    completed: []
  });


  const progressPercentage = Math.round((progress.completed.length / progress.total) * 100);

  return (
    <Card>
      <CardContent>
        <Typography variant='h6'>{sale?.order_no}</Typography>
        <Typography variant='body1' style={{ marginTop: '4px' }}>{sale?.type}</Typography>
        <LinearProgress variant="determinate" value={progressPercentage} style={{ marginTop: '4px' }} />

        <Typography key={sale?.table?.id} variant="body2" color="textSecondary" style={{ marginTop: '4px' }}>{sale?.table?.name}</Typography>

        <Typography variant="body2" color="textSecondary">{`${progressPercentage}%`}</Typography>

        {sale.orderList.map((order) => (
          <SaleOrderItem order={order} setProgress={setProgress} key={order?._id} />
        ))}

      </CardContent>
    </Card>
  )
}

SaleOrderList.propTypes = {
  sale: PropTypes.object
}
