"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import MenuData from "../../data/MegaMenu.json";

import CourseLayout from "./NavProps/CourseLayout";
import PageLayout from "./NavProps/PageLayout";
import ElementsLayout from "./NavProps/ElementsLayout";

import addImage from "../../public/images/service/mobile-cat.jpg";

const KITNav = () => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);

  const pathname = usePathname();

  const isActive = (href) => pathname.startsWith(href);

  const toggleMenuItem = (item) => {
    setActiveMenuItem(activeMenuItem === item ? null : item);
  };

  return (
    <nav className="mainmenu-nav">
      <ul className="mainmenu">
        <li className="with-megamenu has-menu-child-item position-static">
          <Link
            className={`${activeMenuItem === "home" ? "open" : ""}`}
            onClick={() => toggleMenuItem("home")}
            href="#"
          >
            Home
           
          </Link>
         
        </li>

        <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            About
           
          </Link>

         
        </li>

        <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            Newsroom
           
          </Link>

         
        </li>
        
        <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            Members
           
          </Link>

         
        </li>
       <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            Events
           
          </Link>

         
        </li>

        <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            Gallery
           
          </Link>

         
        </li>

         <li className="with-megamenu has-menu-child-item">
          <Link
            className={`${activeMenuItem === "courses" ? "open" : ""}`}
            href="#"
            onClick={() => toggleMenuItem("courses")}
          >
            Contact Us
           
          </Link>

         
        </li>
       
      </ul>
    </nav>
  );
};
export default KITNav;
