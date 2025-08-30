"use client";

import React from "react";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import Separator from "@/components/Common/Separator";

import KITHeader from "@/components/Header/KITHeader";

import KITFooter from "@/components/Footer/KITFooter";
import BreadCrumb from "@/components/Common/BreadCrumb";
import EventsMain from "@/components/(Alumni)/component/main/EventsMain";

const Events = () => {
  return (
    <Provider store={Store}>
      <Context>
        <MobileMenu />
        <KITHeader headerSticky="rbt-sticky" headerType="" />

        <BreadCrumb title="Events" text="Events" />

        <EventsMain />

        

        <Separator />
        <KITFooter />
      </Context>
    </Provider>
  );
};

export default Events;
