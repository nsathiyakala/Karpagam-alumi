"use client";

import Link from "next/link";
import Courses from "../data/dashboard/instructor/instructor.json";
import CourseWidgets from "../components/Instructor/Dashboard-Section/widgets/CourseWidget";
import { useEffect, useState } from "react";
import Image from "next/image";
import GalleryData from "../data/elements/gallery.json";

const GalleryLoginMain = () => {
  const [discountPercentage, setDiscountPercentage] = useState({});
  const [totalReviews, setTotalReviews] = useState({});
  const [rating, setRating] = useState({});

  // Calculate discount, reviews, ratings for each course
  useEffect(() => {
    const discountObj = {};
    const reviewsObj = {};
    const ratingObj = {};

    Courses.forEach((course) => {
      // discount
      let discount = course.coursePrice * ((100 - course.offerPrice) / 100);
      discountObj[course.id] = discount.toFixed(0);

      // reviews
      let reviews =
        course.reviews.oneStar +
        course.reviews.twoStar +
        course.reviews.threeStar +
        course.reviews.fourStar +
        course.reviews.fiveStar;
      reviewsObj[course.id] = reviews;

      // rating
      ratingObj[course.id] = course.rating.average.toFixed(0);
    });

    setDiscountPercentage(discountObj);
    setTotalReviews(reviewsObj);
    setRating(ratingObj);
  }, [Courses]);

  return (
    <>
      <div className="rbt-dashboard-area rbt-section-gapBottom section-pad">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-11 col-xl-10">
              <div className="rbt-dashboard-content ">
                <div className="content">
                  {/* --- TAB BUTTONS --- */}
                  <div className="advance-tab-button mb--30">
                    <ul
                      className="nav nav-tabs tab-button-style-2 justify-content-start"
                      id="myTab-4"
                      role="tablist"
                    >
                      <li role="presentation">
                        <Link
                          href="#"
                          className="tab-button active"
                          id="home-tab-4"
                          data-bs-toggle="tab"
                          data-bs-target="#home-4"
                          role="tab"
                        >
                          <span className="title">Album</span>
                        </Link>
                      </li>
                      <li role="presentation">
                        <Link
                          href="#"
                          className="tab-button"
                          id="profile-tab-4"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-4"
                          role="tab"
                        >
                          <span className="title">Memories</span>
                        </Link>
                      </li>
                     
                    </ul>
                  </div>

                  {/* --- TAB CONTENT --- */}
                  <div className="tab-content">
                    <div className="tab-content">
                      {/* ENROLLED */}
                      <div
                        className="tab-pane fade active show"
                        id="home-4"
                        role="tabpanel"
                      >
                        <div className="row g-3 parent-gallery-container KITgallery">
                          {GalleryData?.gallery?.map((data, index) => (
                            <div
                              className="col-lg-2 col-md-4 col-sm-6 col-6"
                              key={`gallery-enrolled-${index}`}
                            >
                              <div className="instagram-grid">
                                <Link
                                  className="child-gallery-single"
                                  href={`${data.img}`}
                                  data-gall="gallery01"
                                >
                                  <div className="rbt-gallery rounded">
                                    <Image
                                      className="w-100 rounded"
                                      src={data.img}
                                      width={253}
                                      height={274}
                                      alt="Gallery Images"
                                    />
                                  </div>
                                  <span className="user-info">
                                    <span className="icon">
                                      <i className="icon-instagram"></i>
                                    </span>
                                    <span className="user-name">Batch 2</span>
                                    <div className="gallery-dec">2 Photos</div>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTIVE */}
                      <div
                        className="tab-pane fade"
                        id="profile-4"
                        role="tabpanel"
                      >
                        <div className="row g-3 parent-gallery-container KITgallery">
                          {GalleryData?.gallery?.map((data, index) => (
                            <div
                              className="col-lg-2 col-md-4 col-sm-6 col-6"
                              key={`gallery-active-${index}`}
                            >
                              <div className="instagram-grid">
                                <Link
                                  className="child-gallery-single"
                                  href={`${data.img}`}
                                  data-gall="gallery02"
                                >
                                  <div className="rbt-gallery rounded">
                                    <Image
                                      className="w-100 rounded"
                                      src={data.img}
                                      width={253}
                                      height={274}
                                      alt="Gallery Images"
                                    />
                                  </div>
                                  <span className="user-info">
                                    <span className="icon">
                                      <i className="icon-instagram"></i>
                                    </span>
                                    <span className="user-name">Batch 2</span>
                                    <div className="gallery-dec">2 Photos</div>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* COMPLETED */}
                      <div
                        className="tab-pane fade"
                        id="contact-4"
                        role="tabpanel"
                      >
                        <div className="row g-3 parent-gallery-container KITgallery">
                          {GalleryData?.gallery?.map((data, index) => (
                            <div
                              className="col-lg-2 col-md-4 col-sm-6 col-6"
                              key={`gallery-completed-${index}`}
                            >
                              <div className="instagram-grid">
                                <Link
                                  className="child-gallery-single"
                                  href={`${data.img}`}
                                  data-gall="gallery03"
                                >
                                  <div className="rbt-gallery rounded">
                                    <Image
                                      className="w-100 rounded"
                                      src={data.img}
                                      width={253}
                                      height={274}
                                      alt="Gallery Images"
                                    />
                                  </div>
                                  <span className="user-info">
                                    <span className="icon">
                                      <i className="icon-instagram"></i>
                                    </span>
                                    <span className="user-name">Batch 2</span>
                                    <div className="gallery-dec">2 Photos</div>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* --- END TAB CONTENT --- */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryLoginMain;
