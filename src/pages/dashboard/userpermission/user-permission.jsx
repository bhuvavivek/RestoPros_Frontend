import { Helmet } from "react-helmet-async";

import { RoleListView } from "src/sections/userole/view";

export default function UserPermissionPage() {
  return (
    <>

      <Helmet >
        <title>user permission list</title>
      </Helmet>
      <RoleListView />
    </>
  )
}
