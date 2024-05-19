import { Helmet } from "react-helmet-async";

import { UserListView } from "src/sections/users/view";




export default function UserDetailsPage() {
  return (
    <>

      <Helmet >
        <title>add new permissios </title>
      </Helmet>
      <UserListView />
    </>
  )
}
