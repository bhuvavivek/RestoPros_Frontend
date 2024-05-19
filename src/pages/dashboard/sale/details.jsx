import { Helmet } from "react-helmet-async";

import { useParams } from 'src/routes/hooks';

import { SaleDetailsView } from "src/sections/sale/view";

export default function SaleDetailsPage() {

  const params = useParams();

  const { id } = params;
  return (

    <>
      <Helmet>
        <title>Sale Orders</title>
      </Helmet>
      <SaleDetailsView id={id} />
    </>
  )

}
