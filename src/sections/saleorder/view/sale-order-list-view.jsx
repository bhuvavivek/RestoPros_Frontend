
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';


import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import { useEffect, useState } from 'react';
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

    // Emit an event to request the orders
    socketService.emit('get-order');

    socketService.on('Orders', (Orders) => {
      console.log(Orders)
      setSales(Orders)
      setSalesLoading(false);
    })

    // return () => {
    //   socketService.off('orders');
    //   socketService.disconnect();
    // }
  }, [])


  if (salesLoading) {
    return <LoadingScreen />
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
        {sales.map((sale) => (
          <Grid item xs={12} sm={6} md={6} lg={6} xl={4} key={sale.id}>
            <SaleOrderList sale={sale} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
