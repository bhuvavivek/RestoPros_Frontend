import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";

import { useGetSingleSale } from "src/api/sales";

import { PosListView } from "src/sections/pos/view";

export default function PosEditPage() {

  const { id } = useParams();

  const { sale } = useGetSingleSale(id, {
    expand: true,
    orderList: true
  });


  return (
    <>
      <Helmet>
        <title>POS Edit</title>
      </Helmet>
      <PosListView id={id} sale={sale} />
    </>
  )
}
