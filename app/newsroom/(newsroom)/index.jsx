"use client";

import Context from "@/context/Context";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import Separator from "@/components/Common/Separator";
import FooterOne from "@/components/Footer/Footer-One";

import MobileMenu from "@/components/Header/MobileMenu";

import BreadCrumb from "@/components/Common/BreadCrumb";
import KITHeader from "@/components/Header/KITHeader";


import NewsRoomMain from "@/components/(Alumni)/component/main/NewsRoomMain";
import KITFooter from "@/components/Footer/KITFooter";
import SideBar from "@/components/(Alumni)/component/KITSidebar/SideBar";

const NewsRoom = () => {
  return (
    <>
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <KITHeader headerSticky="rbt-sticky" headerType="" />
          <BreadCrumb title="Newsroom" text="Newsroom" />

          <div className="rbt-dashboard-area section-pad">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row g-5">
                    <div className="col-lg-3">
                      <SideBar />
                    </div>

                    <div className="col-lg-9">
                      <NewsRoomMain />
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
    </>
  );
};

export default NewsRoom;
