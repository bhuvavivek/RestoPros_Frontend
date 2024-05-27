import { Grid, } from "@mui/material";
import { Container } from "@mui/system";

import { useGetDashboardCount, useGetSaleOrderCount } from "src/api/dashboard";
import { useGetSales } from "src/api/sales";

import { useSettingsContext } from "src/components/settings";

import DashboardRecentActivity from "../dashboard-recent-activity";
import DashboardWidgetSummery from "../dashboard-widget-summery";


export default function DashboardView() {

  const settings = useSettingsContext();
  const { dashboardCount } = useGetDashboardCount();
  const { saleOrderCount } = useGetSaleOrderCount();

  const { sales } = useGetSales({ page: 1, per_page: 5, expand: true, orderList: true })

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Grid container columnSpacing={3} rowGap={3}>
        {/* <Grid item xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={DurationOptions}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Duration" />}
          />
          <DateRangePicker localeText={{ start: 'Start-Date', end: 'End-date' }} />
        </Grid> */}
        <Grid item xs={12} md={4} >
          <DashboardWidgetSummery
            title="Total Active Users"
            total={dashboardCount?.userCount}
          />
        </Grid>

        <Grid item xs={12} md={4} >
          <DashboardWidgetSummery
            title="Total Category"
            total={dashboardCount?.categoryCount}
          />
        </Grid>

        <Grid item xs={12} md={4} >
          <DashboardWidgetSummery
            title="Orders"
            total={saleOrderCount?.orderCount}
          />
        </Grid>

        <Grid item xs={12} md={4} >
          <DashboardWidgetSummery
            title="Total Sale"
            total={saleOrderCount?.totalGrandTotal}
          />
        </Grid>

        <Grid item xs={12} md={4} >
          <DashboardWidgetSummery
            title="Total Menu "
            total={dashboardCount?.menuCount}
          />
        </Grid>


        <Grid item xs={12} md={12} lg={12}>
          <DashboardRecentActivity
            title="Recent Sales Activity"
            tableData={sales}
            tableLabels={[
              { id: 'orderno', label: 'OrderNo' },
              { id: 'orderinfo', label: 'OrderInfo' },
              { id: 'date', label: 'Date' },
              { id: 'subtotal', label: 'SubTotal' },
              { id: 'discount', label: 'Discount' },
              { id: 'tip', label: 'Tip' },
              { id: 'tax', label: 'Tax' },
              { id: 'createdBy', label: 'CreatedBy' },
              { id: 'status', label: 'Status' },
            ]}
          />
        </Grid>

      </Grid>
    </Container >
  )
}
