
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import socketService from '../../../sockets/socket';
import SaleOrderList from '../sale-order-list';

export default function SaleOrderListView() {
  const settings = useSettingsContext()


  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);

  // const { sales, salesLoading } = useGetSales({
  //   expand: true,
  //   orderList: true,
  //   status: 'pending'
  // })


  useEffect(() => {
    const connected = socketService.isConnected;
    if (connected) {


      // Emit 'get-order' event
      socketService.emit('get-order', { status: "pending" });

      socketService.on('orders', (data) => {
        console.log('Received orders: ', data);
        setSales(data);
        setSalesLoading(false);
      });

      // Listen for 'error' event
      socketService.on('error', (error) => {
        console.error('Error: ', error.message);
      });

    }
  }, []);



  // if (salesLoading) {
  //   return <LoadingScreen />
  // }


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
        {sales.map((sale) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={sale.id}>
            <SaleOrderList sale={sale} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
