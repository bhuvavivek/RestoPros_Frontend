import { Helmet } from "react-helmet-async";

import { CustomerListView } from "src/sections/customer/view";

export default function CustomerPage() {
  return (
    <>

      <Helmet>
        <title>Dashboard: Customer</title>
      </Helmet>
      <CustomerListView />
    </>
  )
}
