import { Helmet } from "react-helmet-async";

import { PosListView } from "src/sections/pos/view";

export default function PosEditDetailPage() {

  return (
    <>
      <Helmet>
        <title>POS Details</title>
      </Helmet>
      <PosListView />
    </>
  )
}
