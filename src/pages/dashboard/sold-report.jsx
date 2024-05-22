import { Helmet } from 'react-helmet-async'

import { SoldReportListView } from 'src/sections/sold-report/view'

export default function SoldReportPage() {
  return (
    <>
      <Helmet>
        <title>Sold Orders</title>
      </Helmet>
      <SoldReportListView />
    </>
  )

}
