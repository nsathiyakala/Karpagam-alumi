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

import React from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import AllMessagesMain from "../KITHelpDesk/AllMessagesMain";

const AllSupportTicketsMain = () => {
  const pathname = usePathname();

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
    return null;
  };

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
                        <div className="col-lg-3">
                          <SideBarHelpDesk />
                        </div>
                        <div className="col-lg-9">{renderContent()}</div>
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
