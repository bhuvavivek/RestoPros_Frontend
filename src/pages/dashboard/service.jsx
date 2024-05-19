import { Helmet } from 'react-helmet-async'

import { ServiceListView } from 'src/sections/service/view'



export default function ServicePage() {
  return (
    <>
      <Helmet>
        <title>Food Categories</title>
      </Helmet>
      <ServiceListView />
    </>
  )

}
