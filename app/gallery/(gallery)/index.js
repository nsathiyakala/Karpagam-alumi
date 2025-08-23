"use client";

import Context from "@/context/Context";
import Store from "@/redux/store";
import { Provider } from "react-redux";

import MobileMenu from "@/components/Header/MobileMenu";

import BreadCrumb from "@/components/Common/BreadCrumb";
import FooterOne from "@/components/Footer/Footer-One";

import KITHeader from "@/components/Header/KITHeader";
import GalleryMain from "@/components/GalleryMain";
import KITFooter from "@/components/Footer/KITFooter";

const GalleryPage = () => {
  return (
    <>
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <KITHeader headerSticky="rbt-sticky" headerType="" />

          <BreadCrumb title="Gallery" text="Gallery" />

          <GalleryMain />

          <KITFooter />
        </Context>
      </Provider>
    </>
  );
};

export default GalleryPage;
