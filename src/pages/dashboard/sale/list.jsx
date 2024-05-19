import { Helmet } from "react-helmet-async";

import { SaleListView } from "src/sections/sale/view";

export default function SaleListPage() {
  return (

    <>
      <Helmet>
        <title>Sale Orders</title>
      </Helmet>
      <SaleListView />
    </>
  )

}
