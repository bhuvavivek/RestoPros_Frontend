import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';

import socketService from 'src/sockets/socket';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import SaleOrderList from '../sale-order-list';

export default function SaleOrderListView() {
  const settings = useSettingsContext();

  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);

  useEffect(() => {
    const connected = socketService.isConnected;
    if (connected) {
      // Emit 'get-order' event
      socketService.emit('get-order', { status: 'pending', expand: 'true', orderList: 'true' });

      const handleOrders = (data) => {
        setSales(data?.data?.orders);
        setSalesLoading(false);
      };

      const handleError = (error) => {
        console.error('Error: ', error.message);
      };

      const handleNewOrder = () => {
        // Emit 'get-order' event again when a new order is received
        socketService.emit('get-order', { status: 'pending', expand: 'true', orderList: 'true' });
      };

      const handleUpdateOrder = () => {
        // Emit 'get-order' event again when an order is updated
        socketService.emit('get-order', { status: 'pending', expand: 'true', orderList: 'true' });
      };

      socketService.on('orders', handleOrders);
      socketService.on('error', handleError);
      socketService.on('newOrder', handleNewOrder);
      socketService.on('updatedOrder', handleUpdateOrder);
    }

    if (!connected) {
      console.log('not connected');
    }
  }, []);

  if (salesLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Order', href: paths.dashboard.product.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {sales?.map((sale) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={sale.id}>
            <SaleOrderList sale={sale} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
