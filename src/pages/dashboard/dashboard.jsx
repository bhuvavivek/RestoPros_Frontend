import { useContext } from "react";
import { Helmet } from "react-helmet-async";

import { AuthContext } from "src/auth/context/jwt";

import { DashboardView } from "src/sections/dashboard/view";

export default function DashboardPage() {

  const { user } = useContext(AuthContext)

  return (
    <>
      <Helmet>
        <title> Dashboard: OverView</title>
      </Helmet>
      <DashboardView />
    </>
  );
}


