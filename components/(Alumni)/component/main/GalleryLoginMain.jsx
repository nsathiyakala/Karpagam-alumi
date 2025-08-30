"use client";

import Link from "next/link";
import Courses from "../../../../data/dashboard/instructor/instructor.json";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import GalleryData from "../../../../data/elements/gallery.json";
import { useRouter } from "next/navigation";
import {
  capitalizeFLetter,
  useSetState,
  validateForm,
} from "@/utils/commonFunction.utils";
import Models from "@/imports/models.import";

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

  // -----------------------------------------

  const router = useRouter();

  const fileInputRef = useRef(null);

  const [state, setState] = useSetState({
    isOpen: false,
    name: "",
    description: "",
    location: "",
    date: "",
    whoCanView: null,
    error: {},
    public_view: "Public",
    currentPage: 1,
    activeTab: 0,
    memoriesList: [],
    memoriescurrentPage: 1,
    memoriesnext: null,
    memoriesprevious: null,
    memoriestotal: null,
    isMemoriesOpen: false,
    uploadedImages: [],
  });

  useEffect(() => {
    albumList(1);
    memoriesList(1);
    getTabs();
  }, []);

  const getTabs = () => {
    const tabs = localStorage.getItem("memoriesBack");
    if (tabs) {
      setState({ activeTab: 1 });
    }
  };

  const albumList = async (page) => {
    try {
      const res = await Models.gallery.albumList(page);
      setState({
        albumList: res?.results,
        currentPage: page,
        next: res?.next,
        previous: res?.previous,
        total: res?.count,
      });
    } catch (error) {
      if (error?.data?.code === "token_not_valid") {
        localStorage.removeItem("token");
        router.push("/login");
      }
      console.log("error: ", error);
    }
  };

  const memoriesList = async (page) => {
    try {
      const res = await Models.gallery.memoriesList(page);
      setState({
        memoriesList: res?.results,
        memoriescurrentPage: page,
        memoriesnext: res?.next,
        memoriesprevious: res?.previous,
        memoriestotal: res?.count,
      });
    } catch (error) {
      if (error?.data?.code === "token_not_valid") {
        localStorage.removeItem("token");
        router.push("/login");
      }
      console.log("error: ", error);
    }
  };

  const handleCancel = () => {
    setState({
      album_name: "",
      description: "",
      album_location: "",
      album_date: "",
      public_view: "Public",
      error: {},
      isOpen: false,
      isMemoriesOpen: false,
    });
  };

  const createAlbum = async () => {
    try {
      setState({ btnLoadng: true });
      const body = {
        album_name: state.album_name,
        description: state.description,
        album_location: state.album_location,
        album_date: state.album_date ? state.album_date : "",
        public_view: state.public_view == "Public" ? "True" : "False",
      };
      console.log("✌️body --->", body);

      const validationRules = {
        album_name: { required: true },
        public_view: { required: true },
        album_date: { required: true },
      };
      const isValid = validateForm(body, validationRules, errorFun);
      console.log("✌️isValid --->", isValid);
      if (isValid) {
        const formData = ConvertFormData(body);
        const res = await Models.gallery.createAlbum(formData);
        console.log("✌️res --->", res);
        message.success("Album Created Successfully");
        await albumList(1);
        setState({
          album_name: "",
          description: "",
          album_location: "",
          album_date: "",
          public_view: "Public",
          error: {},
        });

        setState({ btnLoadng: false, isOpen: false });
      } else {
        setState({ btnLoadng: false });
      }
      if (!isValid) return;
      console.log("body: ", body);
    } catch (error) {
      if (error?.data?.code === "token_not_valid") {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setState({ btnLoadng: false });

      console.log("error: ", error);
    }
  };

  const errorFun = (errors) => {
    setState({ error: errors });
  };

  const handlePageChange = (number) => {
    albumList(number);
    setState({ currentPage: number });
    window.scrollTo({ top: 0, behavior: "smooth" });

    return number;
  };

  const handleMPageChange = (number) => {
    memoriesList(number);
    setState({ memoriescurrentPage: number });
    window.scrollTo({ top: 0, behavior: "smooth" });

    return number;
  };

  const tabs = [
    {
      value: "album",
      label: "album",
    },
    {
      value: "memories",
      label: "memories",
    },
  ];

  const handleFileChange = (e) => {
    const files = e.target.files;
    const imageArray = Array.from(files);
    const newImages = imageArray.filter((image) => {
      return !state.uploadedImages.some(
        (uploadedImage) =>
          uploadedImage.name === image.name &&
          uploadedImage.lastModified === image.lastModified
      );
    });
    setState({ uploadedImages: [...state.uploadedImages, ...newImages] });
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    const updatedImages = state.uploadedImages.filter((_, i) => i !== index);
    setState({ uploadedImages: updatedImages });
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const years = Array.from({ length: 2025 - 1900 + 1 }, (_, i) => {
    const year = 1900 + i;
    return { value: year.toString(), label: year.toString() };
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "long" });
    return { value: (i + 1).toString(), label: month };
  });

  const createMemories = async () => {
    try {
      for (const image of state.uploadedImages) {
        const formData = new FormData();
        formData.append("photos", image);
        formData.append("year", state.year);
        formData.append("month", state.month);
        formData.append("tags", state.tags);
        await Models.gallery.addMemories(formData);
      }
      message.success("Memories Created Successfully");
      await memoriesList(1);
      setState({
        uploadedImages: [],
        year: "",
        month: "",
        tags: "",
        isMemoriesOpen: false,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

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
                          {state.albumList?.map((data, index) => (
                            <div
                              className="col-lg-3 col-md-4 col-sm-6 col-6"
                              key={`gallery-enrolled-${index}`}
                            >
                              <div className="instagram-grid">
                                <Link
                                  className="child-gallery-single"
                                  href={`/album/${data.id}`}
                                  data-gall="gallery01"
                                >
                                  <div className="rbt-gallery rounded">
                                    <img
                                      className="w-100 rounded cover"
                                      src={
                                        data?.photos?.length > 0
                                          ? data?.photos[0]?.photo
                                          : "/images/gallery/gallery-thumb-04.jpg"
                                      }
                                      width={253}
                                      height={274}
                                      alt="Gallery Images"
                                    />
                                  </div>
                                  <span className="user-info">
                                    <span className="icon">
                                      <i className="icon-instagram"></i>
                                    </span>
                                    <span className="user-name">
                                      {data?.album_name}
                                    </span>
                                    <div className="gallery-dec">
                                      {data?.photos?.length} Photos
                                    </div>
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
                          {state.memoriesList?.map((data, index) => (
                            <div
                              className="col-lg-3 col-md-4 col-sm-6 col-6"
                              key={`gallery-active-${index}`}
                            >
                              <div className="instagram-grid">
                                <Link
                                  className="child-gallery-single"
                                  href={`/memories/${data.id}`}
                                  data-gall="gallery02"
                                >
                                  <div className="rbt-gallery rounded">
                                    <img
                                      className="w-100 rounded cover"
                                      src={
                                        data.photos?.length > 0
                                          ? data.photos?.[0]
                                          : "/images/gallery/gallery-thumb-04.jpg"
                                      }
                                      width={253}
                                      height={274}
                                      alt="Gallery Images"
                                    />
                                  </div>
                                  <span className="user-info">
                                    <span className="icon">
                                      <i className="icon-instagram"></i>
                                    </span>
                                    <span className="user-name">
                                      {data.created_by &&
                                        capitalizeFLetter(
                                          data.created_by?.fullname
                                        )}
                                    </span>
                                    <div className="gallery-dec">
                                      {data.created_on}
                                    </div>
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
