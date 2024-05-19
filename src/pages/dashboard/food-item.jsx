import { Helmet } from 'react-helmet-async'

import { FoodItemListView } from 'src/sections/food-item/view'

export default function FoodItemPage() {
  return (
    <>
      <Helmet>
        <title>Food Categories</title>
      </Helmet>
      <FoodItemListView />
    </>
  )

}
