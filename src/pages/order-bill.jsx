import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import { OrderBillView } from "src/sections/orderbill/view";



export default function OrderBillPage() {

  const { id } = useParams();
  return (
    <>
      <Helmet>
        <title>Order Bill</title>
      </Helmet>
      <OrderBillView id={id} />
    </>
  )
}
