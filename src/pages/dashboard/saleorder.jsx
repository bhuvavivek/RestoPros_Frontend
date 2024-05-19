import { Helmet } from 'react-helmet-async'

import { SaleOrderListView } from 'src/sections/saleorder/view'



export default function SaleOrderPage() {
  return (
    <>
      <Helmet>
        <title>Sale Orders</title>
      </Helmet>
      <SaleOrderListView />
    </>
  )
}
