"use client";

import Separator from "@/components/Common/Separator";
import MobileMenu from "@/components/Header/MobileMenu";
import KITHeader from "@/components/Header/KITHeader";
import KITFooter from "@/components/Footer/KITFooter";
import Context from "@/context/Context";
import Store from "@/redux/store";
import SideBarHelpDesk from "../KITSidebar/SideBarHelpDesk";
import BreadCrumb from "../../../Common/BreadCrumb";
import AllTicketsMain from "../KITHelpDesk/AllTicketsMain";
import OpenTicketsMain from "../KITHelpDesk/OpenTicketsMain";
import AllMessagesMain from "../KITHelpDesk/AllMessagesMain";
import AlumniTicketsTable from "./AlumniTicketsTable";
import { useSetState } from "@/utils/commonFunction.utils";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";

const AllSupportTicketsMain = () => {
  const [state, setState] = useSetState({
    alltickets: false,
  });

  const pathname = usePathname();

  // ✅ Move state update logic into useEffect
  useEffect(() => {
    if (pathname.includes("/help-desk/alumni-tickets")) {
      setState({ alltickets: true });
    } else {
      setState({ alltickets: false });
    }
  }, [pathname]);

  const renderContent = () => {
    if (pathname.includes("/help-desk/open-tickets")) {
      return <OpenTicketsMain />;
    }
    if (pathname.includes("/help-desk/all-support-tickets")) {
      return <AllTicketsMain />;
    }
    if (pathname.includes("/help-desk/all-messages")) {
      return <AllMessagesMain />;
    }
    if (pathname.includes("/help-desk/alumni-tickets")) {
      return <AlumniTicketsTable />;
    }
    return null;
  };

  console.log("Current State:", state);
  console.log("Current Path:", pathname);

  return (
    <Provider store={Store}>
      <Context>
        <MobileMenu />
        <KITHeader headerSticky="rbt-sticky" headerType="" />
        <BreadCrumb title="Help Desk" text="Support Tickets" />

        <div className="rbt-dashboard-area rbt-section-gapBottom section-pad">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-11 col-xl-10">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row g-5">
                        {!state?.alltickets && 
                        <div className="col-lg-3">
                          <SideBarHelpDesk />
                        </div>}

                        <div className={`${state?.alltickets ? "col-lg-12" : "col-lg-9"}`}>{renderContent()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />
        <KITFooter />
      </Context>
    </Provider>
  );
};

export default AllSupportTicketsMain;
