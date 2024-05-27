import { Helmet } from 'react-helmet-async'

import { OverallReportListView } from 'src/sections/overAll-report/view'

export default function OverallReportPage() {
  return (
    <>
      <Helmet>
        <title>Overall Report </title>
      </Helmet>
      <OverallReportListView />
    </>
  )

}
