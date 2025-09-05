"use client";

import React, { useEffect, useState } from "react";

import Context from "@/context/Context";
import { Provider } from "react-redux";
import Store from "@/redux/store";
import MobileMenu from "@/components/Header/MobileMenu";
import Cart from "@/components/Header/Offcanvas/Cart";
import Separator from "@/components/Common/Separator";

import KITHeader from "@/components/Header/KITHeader";

import KITFooter from "@/components/Footer/KITFooter";
import BreadCrumb from "@/components/Common/BreadCrumb";
import MembersMain from "@/components/(Alumni)/component/main/MembersMain";
import MembersLoginMain from "@/components/(Alumni)/component/main/MembersLoginMain";
import Form from "@/commonComponents/Form"
import MyAccountMain from "@/components/(Alumni)/component/KITMyAccount/MyAccountMain";
import MyBasicDetailsMain from "@/components/(Alumni)/component/main/MyBasicDetailsMain";
import ProfilePhotographMain from "@/components/(Alumni)/component/main/ProfilePhotographMain";

const ProfilePhotograph = () => {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAlumniManager, setIsAlumniManager] = useState(false);
  const [isFatulty, setIsFatulty] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);

  useEffect(() => {
    const Token = localStorage.getItem("token");

    setToken(Token);
  });

  return (
    <Provider store={Store}>
      <Context>
        <MobileMenu />
        <KITHeader headerSticky="rbt-sticky" headerType="" />

        <BreadCrumb title="Members" text="Members" />

        <ProfilePhotographMain/>

       

        <Separator />
        <KITFooter />
      </Context>
    </Provider>
  );
};

export default ProfilePhotograph;
