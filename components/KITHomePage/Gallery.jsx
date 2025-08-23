"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import "venobox/dist/venobox.min.css";

import InstagramData from "../../data/elements/instagram.json";


const Gallery = () => {
  useEffect(() => {
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".child-gallery-single",
        numeration: true,
        infinigall: true,
        spinner: "rotating-plane",
      });
    });
  }, []);
  return (
    <div className="rbt-instagram-area bg-color-white section-pad">
      {/* <div className="container">
        <div className="row">
          <div className="col-lg-12 mb--60 mb_sm--50">
            <div className="section-title text-center">
              <h6 className="b2 mb--15">
                <span className="theme-gradient">Instagram</span>
              </h6>
              <h2 className="title w-600">
                Latest Pictures
                <span className="theme-gradient">Instagram</span>
              </h2>

               <p className="mt-4">Equal blame belongs to those who fail in their duty through weakness of will, which is the <br /> same as saying through shrinking from toil and pain.</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container-fluid">
        <div className="row g-3">
          {InstagramData.instagramTwo.map((data, i) => (
            <div className="col-lg-2 col-md-4 col-sm-6 col-6" key={i}>
              <div className="instagram-grid">
                <Link href={data.link} className="child-gallery-single">
                  <div className="rbt-gallery">
                    <Image
                    className="w-100"
                      src={data.image}
                      width={229}
                      height={257}
                      unoptimized={true}
                      alt={data.alt}
                      data-gall="gallery01"
                    />
                  </div>

                  <span className="user-info">
                    <span className="icon">
                      <i className="icon-instagram"></i>
                    </span>
                    <span className="user-name">{data.text}</span>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
