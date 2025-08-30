"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "venobox/dist/venobox.min.css";
import { useRouter, useParams } from "next/navigation";
import { message, Modal } from "antd";
import { useSetState } from "@/utils/commonFunction.utils";
import Models from "@/imports/models.import";

const AlbumMain = () => {


  const params = useParams();
  const id = params.id;

  console.log("id", id);

  const { confirm } = Modal;

  const [messageApi, contextHolder] = message.useMessage();

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
    isUploadPic: false,
    uploadedImages: [],
  });

  console.log("id", id);




  useEffect(() => {
    albumDetails();
    photoList(1);
    localStorage.removeItem("memoriesBack");
  }, [id]);

  const albumDetails = async () => {
    try {
      const res = await Models.gallery.albumDetails(id);
      setState({
        album_name: res?.album_name,
        album_date: res?.album_date,
        description: res?.description,
        album_location: res?.album_location,
        public_view: res?.public_view ? "Public" : "Site Members",
        data: res,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const photoList = async (page) => {
    try {
      const res = await Models.gallery.photoList(id, page);
      console.log("photoList --->", res);
      setState({
        photoList: res?.results,
        currentPage: page,
        next: res?.next,
        previous: res?.previous,
        total: res?.count,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleCancel = () => {
    setState({ isOpen: false });
  };

  const updateAlbum = async () => {
    try {
      setState({ btnLoadng: true });
      const body = {
        album_name: state.album_name,
        description: state.description,
        album_location: state.album_location,
        album_date: state.album_date ? state.album_date : "",
        public_view: state.public_view == "Public" ? "True" : "False",
      };

      const validationRules = {
        album_name: { required: true },
        public_view: { required: true },
        album_date: { required: true },
      };
      const isValid = validateForm(body, validationRules, errorFun);
      if (isValid) {
        const formData = ConvertFormData(body);
        await Models.gallery.updateAlbum(id, formData);
        messageApi.success("Album updated successfully");
        await albumDetails();
        setState({ btnLoadng: false, isOpen: false });
      } else {
        setState({ btnLoadng: false });
      }
      if (!isValid) return;
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

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure, You want to delete album?",
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDeleteAlbum();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDeleteAlbum = async () => {
    try {
      await Models.gallery.deleteAlbum(id);
      router.push("/gallery");
    } catch (error) {
      console.log("error: ", error);
    }
  };

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

  const uploadPhoto = async () => {
    try {
      setState({ uploadLoading: true });

      for (const image of state.uploadedImages) {
        const formData = new FormData();
        formData.append("photos", image);
        await Models.gallery.addPhoto(id, formData);
      }

      setState({
        isUploadPic: false,
        uploadLoading: false,
        uploadedImages: [],
      });

      await photoList(1);
    } catch (error) {
      setState({ uploadLoading: false });
      console.log("✌️error --->", error);
    }
  };

  console.log("state.photoList", state.photoList);

  const handlePageChange = (number) => {
    photoList(number);
    setState({ currentPage: number });
    window.scrollTo({ top: 0, behavior: "smooth" });

    return number;
  };

  const deletePhoto = async (item) => {
    console.log("✌️item --->", item);
    console.log("hello");

    try {
      const res = await Models.gallery.deletePhoto(item?.id);

      await photoList(state.currentPage);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const approvel = async (item) => {
    try {
      await Models.gallery.approvePhoto(item?.id);
      await photoList(state.currentPage);
      messageApi.success("Photo approved successfully");
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };






  return (
    <div className="row g-3 parent-gallery-container KITgallery ">
      {state.photoList &&
        state.photoList.map((data, index) => (
          <div className="col-lg-2 col-md-4 col-sm-6 col-6" key={index}>
            <div className="instagram-grid KITalbum">
              <div
                className="child-gallery-single gal-grid"
                key={index}
                href={data.img || "#"} // ✅ Ensure href is valid
                data-gall="gallery01"
                onClick={(e) => {
                  if (e.target.closest(".icon")) {
                    // ✅ If the click came from the delete icon, prevent navigation
                    e.preventDefault();
                  }
                }}
              >
                <div className="rbt-gallery rounded">
                  <img
                    className="w-100 rounded"
                    src={data.url}
                    width={253}
                    height={274}
                    alt="Gallery Images"
                  />
                </div>



                <div className="gal-delete-icon">
                  {(data?.is_admin || data?.is_owner) && (
                    <span
                      className="icon pr-5"
                      onClick={(e) => {
                        e.preventDefault(); // ✅ Prevent Link navigation
                        e.stopPropagation(); // ✅ Stop bubbling
                        deletePhoto(data); // ✅ Call delete function
                      }}
                    >
                      <i className="feather-trash"></i>
                    </span>


                  )}


                  {data?.approved == true ? <span
                    className="icon "
                    onClick={() => approvel(data)}
                  >
                    <i className="feather-check-circle"></i>
                  </span>
                    :
                    <span
                      className="icon "
                      onClick={() => approvel(data)}
                    >
                      <i className="feather-x-circle"></i>
                    </span>
                  }

                </div>





                <span className="user-info">

                  <span className="user-name"
                    onClick={() => approvel(url)}
                  >{data?.approved == true ? "Approved" : "Pending"}</span>

                </span>
              </div>
            </div>
          </div>
        ))}
    </div>

  );
};

export default AlbumMain;
