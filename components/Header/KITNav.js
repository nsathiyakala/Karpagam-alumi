"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

import { menus } from "@/utils/constant.utils";
import { useSetState } from "@/utils/commonFunction.utils";

const KITNav = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);

  const toggleMenuItem = (item) => {
    setActiveMenuItem(activeMenuItem === item ? null : item);
  };

  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAlumniManager, setIsAlumniManager] = useState(false);
  const [isFatulty, setIsFatulty] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);

  const [state, setState] = useSetState({
    menuList: menus,
    userMenu: [],
  });
  useEffect(() => {
    const Token = localStorage.getItem("token");
    // if (!Token) {
    //   window.location.href = "/login";
    // }
    setToken(Token);

    const Admin = localStorage.getItem("isAdmin");
    setIsAdmin(Admin);

    const AlumniManager = localStorage.getItem("isAlumniManager");
    setIsAlumniManager(AlumniManager);

    const Faculty = localStorage.getItem("isFaculty");
    setIsFatulty(Faculty);

    const Alumni = localStorage.getItem("isAlumni");
    setIsAlumni(Alumni);
  }, []);

  useEffect(() => {
    if (token && isAdmin) {
      setState({ userMenu: state?.menuList?.admin });
    } else if (token && isAlumniManager) {
      setState({ userMenu: state?.menuList?.alumniManager });
    } else if (token && isAlumni) {
      setState({ userMenu: state?.menuList?.alumni });
    } else if (token && isFatulty) {
      setState({ userMenu: state?.menuList?.faculty });
    } else if (token) {
      // logged in but no specific role
      setState({ userMenu: state?.menuList?.user });
    } else {
      // not logged in
      setState({ userMenu: state?.menuList?.guest });
    }
  }, [token, isAdmin, isAlumniManager, isAlumni, isFatulty, state.menuList]);

  console.log("menu", state.menuList);

  //   const getUserMenu = () => {
  //   if (token) {
  //     return setState({userMenu:state?.menuList?.user})

  //   } else if (isAdmin) {
  //     return setState({userMenu:state?.menuList?.admin})

  //   } else if (isAlumniManager) {
  //     return setState({userMenu:state?.menuList?.alumniManager})
  // ;
  //   } else if (isAlumni) {
  //     return setState({userMenu:state?.menuList?.alumni})
  //   } else if (isFatulty) {
  //     return setState({userMenu:state?.menuList?.faculty})
  //   } else {
  //     return setState({userMenu:state?.menuList?.guest})
  //   }
  // };

  console.log("userMenu", state.userMenu);

  return (
    <nav className="mainmenu-nav">
      <ul className="mainmenu">
        {state.userMenu?.map((menu) => (
          <li
            key={menu.key}
            className="with-megamenu has-menu-child-item position-static"
          >
            <Link
              className={activeMenuItem === menu.key ? "open" : ""}
              href={menu.href}
              onClick={() => toggleMenuItem(menu.key)}
            >
              {menu.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default KITNav;
