import { Helmet } from "react-helmet-async";

import { UserCreateView } from "src/sections/users/view";



export default function UserNewPage() {
  return (
    <>

      <Helmet >
        <title>add new User </title>
      </Helmet>
      <UserCreateView />
    </>
  )
}
