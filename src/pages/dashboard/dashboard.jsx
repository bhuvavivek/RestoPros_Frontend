import { Helmet } from "react-helmet-async";

import { DashboardView } from "src/sections/dashboard/view";

export default function DashboardPage() {



  return (
    <>
      <Helmet>
        <title> Dashboard: OverView</title>
      </Helmet>
      <DashboardView />
    </>
  );
}


