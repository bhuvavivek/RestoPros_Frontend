import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { useGetSingleSale } from 'src/api/sales';

import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import SaleOrderDialog from '../edit-sale-order';
import SaleDetailsInfo from '../sale-details-info';
import OrderDetailsItems from '../sale-details-item';
import OrderDetailsToolbar from '../sale-details-toolbar';

// ----------------------------------------------------------------------

export default function SaleDetailsView({ id }) {
  const settings = useSettingsContext();



  const paymentPopup = useBoolean()

  const { sale, saleLoading, refetch } = useGetSingleSale(id, { expand: true, orderList: true });

  if (saleLoading) {
    return <LoadingScreen />
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={sale?.order_no}
        createdAt={sale?.createdAt}
        status={sale?.status}
        statusOptions={ORDER_STATUS_OPTIONS}
        openEditDialog={paymentPopup.onTrue}
        orderId={id}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={sale.orderList}
              taxes={sale?.tax}
              tip={sale?.tip}
              discount={sale?.discount}
              subTotal={sale?.subtotal}
              totalAmount={sale?.status === "completed" ? sale?.grand_total : sale?.subtotal}
            />
            {/* <OrderDetailsHistory history={sale?.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <SaleDetailsInfo
            customer={sale?.customer}
            table={sale?.table}
            createdBy={sale?.created_by}
          />
        </Grid>
      </Grid>

      <SaleOrderDialog open={paymentPopup.value} onClose={paymentPopup.onFalse} saleinfo={sale} refetch={refetch} />
    </Container>
  );
}

SaleDetailsView.propTypes = {
  id: PropTypes.string,
};
