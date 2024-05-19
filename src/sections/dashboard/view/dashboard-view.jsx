
import { Grid, } from "@mui/material";
import { Container } from "@mui/system";

import { _recentActivities } from "src/_mock";

import { useSettingsContext } from "src/components/settings";

import AppAreaInstalled from "src/sections/overview/app/app-area-installed";

import DashboardRecentActivity from "../dashboard-recent-activity";
import DashboardWidgetSummery from "../dashboard-widget-summery";


export default function DashboardView() {

  const settings = useSettingsContext();
  // const theme = useTheme();
  // const { user } = useMockedUser();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Grid container columnSpacing={3} rowGap={3}>
        {
          Array.from({ length: 9 }).map((_, index) => (
            <Grid item xs={12} md={4} >
              <DashboardWidgetSummery
                key={index}
                title="Total Active Users"
                percent={2.6}
                total={18765}
                lasttotal={1200}
                lasttime="Today"
              />
            </Grid>
          ))
        }

        <Grid item xs={12} md={12} lg={12} >
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={12} lg={12} >
          <DashboardRecentActivity
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}

        <Grid item sx={12} md={12} lg={12}>
          <DashboardRecentActivity
            title="Recent Activity"
            tableData={_recentActivities}
            tableLabels={[
              { id: 'title', label: 'Title' },
              { id: 'id', label: 'Order ID' },
              { id: 'date', label: 'Date' },
              { id: 'quantity', label: 'Quantity' },
              { id: 'price', label: 'Price' },
              { id: 'totalPrice', label: 'Total Amount' },
              { id: 'status', label: 'Status' },
            ]}
          />
        </Grid>




      </Grid>
    </Container>
  )
}
