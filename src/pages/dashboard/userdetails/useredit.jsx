import { Helmet } from "react-helmet-async";

import { UserEditView } from "src/sections/users/view";



export default function UserEditPage() {
  return (
    <>

      <Helmet >
        <title>add new permissios </title>
      </Helmet>
      <UserEditView />
    </>
  )
}
