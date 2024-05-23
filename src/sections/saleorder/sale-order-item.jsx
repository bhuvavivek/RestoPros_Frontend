import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { Checkbox, FormControlLabel, Grid } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

export default function SaleOrderItem({ order, setProgress }) {

  const [itemCheck, setItemCheck] = useState(false);
  const handleCheck = async (orderId) => {
    try {
      const response = await axiosInstance.patch(endpoints.editOrder.editStatus(orderId), {
        status: "completed"
      });
      if (response.status === 200) {
        setItemCheck(true)
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const orderId = order._id
    if (itemCheck) {
      setProgress((prev) => {
        if (!prev.completed.includes(orderId)) {
          return {
            ...prev,
            completed: [...prev.completed, orderId]
          }
        }

        return prev;
      })
    }
  }, [itemCheck, order._id, setProgress])

  useEffect(() => {
    if (order) {
      const checkstatus = order.status === 'completed';
      setItemCheck(checkstatus)
    }
  }, [order])


  return (
    <Grid item xs={12} key={order.item_id}>
      <FormControlLabel
        control={
          <Checkbox
            style={{ transform: 'scale(1.2)' }}
            onChange={() => handleCheck(order._id)}
            checked={itemCheck}
            disabled={itemCheck}
          />
        }
        label={`${order?.menuItems?.itemName} - ${order.quantity} - ${order.price}₹`}
      />
    </Grid>
  );
}

SaleOrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  setProgress: PropTypes.func,
}
