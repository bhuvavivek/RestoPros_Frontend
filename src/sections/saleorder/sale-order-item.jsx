import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { Checkbox, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import axiosInstance, { endpoints } from 'src/utils/axios';

export default function SaleOrderItem({ order, setProgress }) {
  const [itemCheck, setItemCheck] = useState(false);
  const handleCheck = async (orderId) => {
    try {
      const response = await axiosInstance.patch(endpoints.editOrder.editStatus(orderId), {
        status: 'completed',
      });
      if (response.status === 200) {
        // setItemCheck(true)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const orderId = order._id;
    if (itemCheck) {
      setProgress((prev) => {
        if (!prev.completed.includes(orderId)) {
          return {
            ...prev,
            completed: [...prev.completed, orderId],
          };
        }

        return prev;
      });
    }
  }, [itemCheck, order._id, setProgress]);

  useEffect(() => {
    if (order) {
      const checkstatus = order.status === 'completed';
      setItemCheck(checkstatus);
    }
  }, [order]);

  return (
    <Grid item xs={12} key={order.item_id} style={{ width: '100%' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        onClick={() => handleCheck(order._id)}
        sx={{
          cursor: 'pointer',
        }}
      >
        <Checkbox
          style={{ transform: 'scale(1.2)' }}
          onChange={(e) => {
            e.stopPropagation();
            handleCheck(order._id);
          }}
          checked={itemCheck}
          disabled={itemCheck}
          sx={{
            color: itemCheck ? 'green' : 'default',
            '&.Mui-checked': {
              color: 'green',
            },
          }}
        />
        <Typography variant="body1" sx={{ flexGrow: 1, marginLeft: 1 }}>
          {order?.menuItems?.itemName}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'end' }}>
          {order.quantity}
        </Typography>
      </Stack>
    </Grid>
  );
}

SaleOrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  setProgress: PropTypes.func,
};
