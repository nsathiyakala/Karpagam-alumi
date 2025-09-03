import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import AccountInfo from "../../../../data/myAccount.json";
import MyAccount from "../../../My-Account/MyAccount";
import FormField from "@/commonComponents/FormFields";
import { useRouter } from "next/navigation";
import {
  setDropdownData,
  useSetState,
  validateForm,
} from "@/utils/commonFunction.utils";
import { message, Modal } from "antd";
import { BloodGroupChooice } from "@/utils/constant.utils";
import Models from "@/imports/models.import";
import axios from "axios";
import { BaseURL } from "@/utils/BaseUrl";

const MyProfileSkillsMain = () => {
  const { confirm } = Modal;
  const [activeIndex, setActiveIndex] = useState(4);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  const [isOpen, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState({
    status: false,
    key: 1,
  });
  const [formData, setFormData] = useState({
    skill_id: "",
    member_skill_id: "",
    // degree: "",
    // location: "",
    // start_year: "",
    // end_year: null,
    // is_currently_pursuing: false,
  });
  const [memberId, setMemberId] = useState("");
  const [getMemberEducation, setMemberEducation] = useState([]);
  const [institute, setInstitute] = useState([]);

  const router = useRouter();

  const [errMsg, setErrMsg] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const [state, setState] = useSetState({
    currenSkillPage: 1,
    hasSkillLoadMore: null,
  });

  useEffect(() => {
    skillList();
  }, []);

  useEffect(() => {
    const MEMBERID = localStorage.getItem("member_id");
    setMemberId(MEMBERID);

    const Admin = localStorage.getItem("isAdmin");
    Admin == true || (Admin == "true" && router.push("/users"));
  }, []);

  useEffect(() => {
    if (memberId) {
      GetMemberEducation();
    }
  }, [memberId]);

  const skillList = async () => {
    try {
      const res = await Models.masters.skillList(1);
      const InstituteOption = res?.results?.map((institute) => ({
        value: institute.skill_id,
        label: institute.skill,
      }));
      setInstitute(InstituteOption);
      setState({ hasSkillLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const skillListLoadMore = async () => {
    try {
      if (state.hasSkillLoadMore) {
        const res = await Models.job.skillList(state.currenSkillPage + 1);
        const SkillOption = res?.results?.map((skill) => ({
          value: skill.skill_id,
          label: skill.skill,
        }));

        setInstitute([...institute, ...SkillOption]);

        setState({
          currenSkillPage: state.currenSkillPage + 1,
          hasSkillLoadMore: res.next,
        });
      } else {
        setInstitute(institute);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const GetMemberEducation = async () => {
    try {
      const res = await Models.member.member_skills(memberId);
      setMemberEducation(res?.results || []);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // Set to checked for checkboxes
    }));
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    console?.log("formDdata:", formData);

    const validationRules = {
      skill_id: {
        required: true,
      },
    };

    const isValid = validateForm(formData, validationRules, setErrMsg);
    if (!isValid) return;

    const body = {
      member_id: memberId,
      skill_id: formData.skill_id.value,
    };

    // Conditionally add end_year if not currently pursuing

    if (isEditing) {
      try {
        const res = await axios.post(
          `${BaseURL}/update_member_skill/${formData.member_skill_id}/`,
          body,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        messageApi.open({
          type: "success",
          content: res.data.message,
        });

        setIsModalOpen(false);

        GetMemberEducation();

        setFormData({
          skill_id: "",
        });

        // router.push("/profile-photograph");
      } catch (error) {
        console.log("error :", error);
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      }
    } else {
      try {
        const res = await axios.post(`${BaseURL}/create_member_skill/`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        messageApi.open({
          type: "success",
          content: res.data.message,
        });

        setIsModalOpen(false);

        GetMemberEducation();

        setFormData({
          skill_id: "",
        });

        // router.push("/profile-photograph");
      } catch (error) {
        console.log("error :", error);
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({
      skill_id: "",
    });
  };

  const showModal = () => {
    setFormData({
      skill_id: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const editDepartment = (department) => () => {
    setIsEditing(true);
    setIsModalOpen(true);
    setFormData({
      skill_id: department.skill_id,
      member_skill_id: department.member_skill_id,
    });
  };

  const showDeleteConfirm = (department) => {
    confirm({
      title: "Delete this skill?",
      content: "Are you sure you want to delete this skill?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        axios
          .delete(
            `${BaseURL}/delete_member_skill/${department.member_skill_id}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            console.log("✌️response --->", response);
            message.success(response.data.message || "Operation successful!");

            GetMemberEducation();
          })
          .catch((error) => {
            console.log("❌error --->", error);
            message.error(
              error.response?.data?.error ||
                "An error occurred. Please try again."
            );
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });

    // Perform is_active logic here if needed
  };

  return (
    <>
     {contextHolder}

      <div className="my-account-section bg-color-white section-pad">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row g-5">
                <div className="col-lg-3 col-12">
                  <div className="rbt-my-account-tab-button nav" role="tablist">
                    <Link href="edit-basic-profile">Basic Details</Link>
                    <Link href="edit-profile-picture">Profile Picture</Link>
                    <Link href="edit-profile-education">Education</Link>
                    <Link href="edit-profile-skills" className="active">
                      Skills
                    </Link>

                    <Link href="edit-profile-experience">Experience</Link>
                    <Link href="edit-profile-contact">Contact</Link>
                    <Link href="edit-milestone">Milestone</Link>
                  </div>
                </div>
                <div className="col-lg-9 col-12">
                  <div className="rbt-video-area bg-color-white overflow-hidden event-form rbt-shadow-box">
                    <div className="container">
                      <div className="row row--15 gy-5">
                        <div className="section-title d-flex justify-content-between">
                          <h4 class="rbt-title-style-3 mb-0">
                            Skills
                            <div
                              className="text-gray mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              Please update Skills details here
                            </div>
                          </h4>

                          <div class="rbt-button-group align-items-start">
                            <div
                              class="rbt-btn btn-xs  radius-round"
                              title="Add Skill"
                              onClick={showModal}
                            >
                              <i className="feather-plus pl--0"></i>
                            </div>
                          </div>
                        </div>

                        <div className="form-wrapper">
                          <div className=" contact-form-style-1 max-width-auto py-0 px-3">
                            <div
                              id="contact-form"
                              className="rainbow-dynamic-form max-width-auto"
                              onSubmit={(e) => handleSubmit(e)}
                            >
                              {getMemberEducation?.length > 0 ? (
                                <div className=" ">
                                  <div className="sidebar-widget category-widget">
                                    <div className="widget-content">
                                      {getMemberEducation?.map((edu, index) => (
                                        <div
                                          className="py-3 px-5 bg-color-darker mb-3  rounded-3"
                                          key={index}
                                          style={{ position: "relative" }}
                                        >
                                          <h6 className="mb-2">
                                            <Link
                                              href="#"
                                              style={{
                                                textTransform: "capitalize",
                                                color: "white",
                                              }}
                                            >
                                              {edu?.skill_name}
                                            </Link>
                                          </h6>

                                        

                                          <div
                                            className="rbt-button-group"
                                            style={{
                                              position: "absolute",
                                              top: "8px",
                                              right: "15px",
                                              zIndex: "10",
                                            }}
                                          >
                                            <button
                                              className="rbt-btn bg-white btn-xs  radius-round eve-edit"
                                              onClick={editDepartment(edu)}
                                              title="Edit"
                                            >
                                              <i
                                                className="feather-edit pl--0 text-black "
                                                style={{ fontSize: "14px" }}
                                              ></i>
                                            </button>
                                            <button
                                              className="rbt-btn bg-white btn-xs  radius-round "
                                              onClick={() =>
                                                showDeleteConfirm(edu)
                                              }
                                              title="Active"
                                            >
                                              <i
                                                className="feather-trash pl--0 text-black "
                                                style={{ fontSize: "14px" }}
                                              ></i>
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className="text-gray mt-2"
                                    style={{ fontSize: "14px" }}
                                  >
                                    No Skills added
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          <div className="custom-modal-header">
            {isEditing ? "Edit Profile Education" : "Create Profile Education"}
          </div>
        }
        open={isModalOpen}
        onCancel={() => handleCancel()}
        footer={false}
        centered
      >
        {/* 4. Form Wrapper */}
        <form className="applicants-form" onSubmit={handleEducationSubmit}>
          {/* 5. Status Select (Load More) */}
          <div style={{ marginTop: "15px" }}>
            <FormField
              type="loadMoreSelect"
                name="skill_id"
                label="Skill"
                // className={"applicant-input "}
                  onChange={(value) =>
                  setFormData({
                    ...formData,
                    skill_id: value,
                  })
                }
                value={formData.skill_id}
                options={institute}
                error={errMsg?.skill_id}
                required
                loadMore={() => skillListLoadMore()}
            />
          </div>

          

          {/* 7. Submit Button */}
          <div className="d-flex justify-content-end mt-5 gap-3">
            <button
              className="rbt-btn btn-gradient radius-round sm-btn"
              type="button"
              onClick={() => handleCancel()}
            >
              cancel
            </button>

            <button
              className="rbt-btn btn-gradient radius-round sm-btn"
              type="submit"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default MyProfileSkillsMain;
