"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import "venobox/dist/venobox.min.css";

import GalleryData from "../data/elements/gallery.json";
import { useRouter, useParams } from "next/navigation";
import { message, Modal } from "antd";
import { useSetState } from "@/utils/commonFunction.utils";
import Models from "@/imports/models.import";
import FormField from "@/commonComponents/FormFields";

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
    import("venobox/dist/venobox.min.js").then((venobox) => {
      new venobox.default({
        selector: ".child-gallery-single",
        numeration: true,
        infinigall: true,
        spinner: "rotating-plane",
      });
    });
  }, []);

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
    <>
      {state.photoList?.length > 0 ? (
        <div className="container album">
          <div className="row g-3 parent-gallery-container KITgallery ">
            <div className="d-flex justify-content-between ">
              <h3>{state.album_name}</h3>

              <div className="rbt-button-group justify-content-end">
                <a
                  className="rbt-btn btn-xs bg-primary-opacity radius-round"
                  href="#"
                  title="Edit Album"
                  onClick={() => setState({ isOpen: true })}
                >
                  <i className="feather-edit pl--0" />
                </a>
                <a
                  className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                  href="#"
                  title="Delete Album"
                  onClick={() => showDeleteConfirm()}
                >
                  <i className="feather-trash-2 pl--0" />
                </a>

                <a
                  className="rbt-btn btn-xs  radius-round"
                  href="#"
                  title="Create Album"
                  onClick={() => setState({ isUploadPic: true })}
                >
                  <i className="feather-plus-circle pl--0" />
                </a>
              </div>
            </div>

            <div className="row parent-gallery-container">
              {state.photoList &&
                state.photoList.map((data, index) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={index}>
                    <div className="instagram-grid KITalbum">
                      <Link
                        className="child-gallery-single gal-grid"
                        key={index}
                        href={`${data.url}`}
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

                          {data?.approved == true ? (
                            <span
                              className="icon "
                              onClick={() => approvel(data)}
                            >
                              <i className="feather-check-circle"></i>
                            </span>
                          ) : (
                            <span
                              className="icon "
                              onClick={() => approvel(data)}
                            >
                              <i className="feather-x-circle"></i>
                            </span>
                          )}
                        </div>

                        <span className="user-info">
                          <span className="user-name">
                            {data?.approved == true ? "Approved" : "Pending"}
                          </span>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className=" album-none">
            <h5>Album is Empty !</h5>
            <a
              className="rbt-btn btn-xs  radius-round"
              href="#"
              title="Create Album"
              onClick={() => setState({ isUploadPic: true })}
            >
              Upload Images
              <i className="feather-plus-circle pl--2" />
            </a>
          </div>
        </>
      )}

      {/* For Edit Album */}
      <Modal
        title={<div className="custom-modal-header">{"Edit Album"}</div>}
        open={state.isOpen}
        onCancel={() => handleCancel()}
        footer={false}
        centered
      >
        <div className="form-group mt_20">
          <FormField
            type="text"
            name="Name"
            label="Name"
            // className={"applicant-input"}
            onChange={(e) => setState({ album_name: e.target.value })}
            value={state.album_name}
            required
            error={state.error?.album_name}
          />
          <div className="form-group mt_20">
            <FormField
              type="text"
              name="Description"
              label="Description"
              // className={"applicant-input"}
              onChange={(e) => setState({ description: e.target.value })}
              value={state.description}
              // error={errMsg?.end_year}
            />
          </div>

          <div className="form-group mt_20">
            <FormField
              type="text"
              name="Location"
              label="Location"
              // className={"applicant-input"}
              onChange={(e) => setState({ album_location: e.target.value })}
              value={state.album_location}
              // error={errMsg?.end_year}
            />
          </div>

          <div className="form-group mt_20">
            <FormField
              placeholder="Date"
              type="date"
              name="Date"
              value={state.album_date}
              onChange={(e) => setState({ album_date: e.target.value })}
              // className="applicant-input"
              required
              error={state.error?.album_date}
            />
          </div>

          <div className="form-group mt_20">
            <FormField
              type="select"
              name="Who can view this Album?"
              label=""
              className={"applicant-input"}
              onChange={(e) => setState({ public_view: e.target.value })}
              value={state.public_view}
              required
              error={state.error?.whoCanView}
              options={[
                { value: "Public", label: "Public" },
                { value: "Site Members", label: "Site Members" },
              ]}
            />
          </div>
        </div>

        <div className="form-group mt_10"></div>
        <div className=" form-group message-btn mt-3 w-100">
          <button
            type="button"
            style={{
              border: "1px solid #006837",
              padding: "9px 30px",
              color: "#006837",
              width: "49%",
              marginRight: "1%",
              cursor: "pointer",
            }}
            name="cancel-form"
            onClick={() => handleCancel()}
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={updateAlbum}
            type="button"
            className="theme-btn btn-two"
            name="submit-form"
            style={{ width: "49%", marginLeft: "1%", cursor: "pointer" }}
          >
            <span>{state.btnLoadng ? <Loader /> : "Submit"}</span>
          </button>
        </div>
      </Modal>

      {/* Upload photos */}
      <Modal
        title={<div className="custom-modal-header">{"Upload Photos"}</div>}
        open={state.isUploadPic}
        onCancel={() => setState({ isUploadPic: false })}
        footer={false}
      >
        <div className="form-group mt_10">
          <input
            type="file"
            name="Name"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
            ref={fileInputRef}
          />
        </div>

        <div
          className="uploaded-images mt_10"
          style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
        >
          {state.uploadedImages.length > 0 &&
            state.uploadedImages.map((image, index) => (
              <div
                key={index}
                className="uploaded-image-item"
                style={{
                  width: "calc(33.333% - 10px)", // To make 3 images per row with spacing
                  display: "flex",
                  flexDirection: "column", // Stack the image and button vertically
                  alignItems: "center", // Center the image and button horizontally
                  justifyContent: "center", // Center align vertically
                  marginBottom: "10px",
                  border: "0.5px solid grey",
                  padding: "10px",
                  borderRadius: "20px",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index + 1}`}
                  style={{
                    width: "100%", // Make image take full width of the container
                    height: "100px", // Fixed height for the images
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />

                {/* Remove button below the image */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    background: "rgba(255, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px 10px",
                    borderRadius: "50px",
                    marginTop: "5px", // Space between image and button
                    fontSize: "14px",
                  }}
                >
                  X
                </button>
              </div>
            ))}
        </div>

        <div
          className="form-group message-btn mt-3 w-100"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <button
            onClick={uploadPhoto}
            type="button"
            className="theme-btn btn-two"
            name="submit-form"
            style={{ width: "30%", marginLeft: "1%", cursor: "pointer" }}
          >
            <span>{state.uploadLoading ? <Loader /> : "Submit"}</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AlbumMain;
