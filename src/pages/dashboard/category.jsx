import { Helmet } from 'react-helmet-async'

import { CategoryListView } from 'src/sections/category/view'

export default function CategoryPage() {
  return (
    <>
      <Helmet>
        <title>Food Categories</title>
      </Helmet>
      <CategoryListView />
    </>
  )

}
