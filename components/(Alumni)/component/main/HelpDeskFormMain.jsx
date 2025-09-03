"use client";

import React, { useEffect, useState, useRef } from "react";
import { DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Select } from "antd";
import Link from "next/link";
import { BaseURL } from "@/utils/BaseUrl";
import {
  setDropdownData,
  useSetState,
  validateForm,
} from "@/utils/commonFunction.utils";
import FormField from "@/commonComponents/FormFields";
import { jobTypeOption, YearOfExperience } from "@/utils/constant.utils";
import axios from "axios";
import Models from "@/imports/models.import";


const HelpDeskFormMain = () => {
 const router = useRouter();

  const [formData, setFormData] = useState({
    category: "",
    content: "",
  });

  const [fixedFormData, setFixedFormData] = useState({
    full_name: "",
    email: "",
    contact: "",
  });

  const [errMsg, setErrMsg] = useState({});
  const [categoryTicket, setCategoryTicket] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const Token = localStorage.getItem("token");
    setToken(Token);
    if (!Token) {
      router.push("/login");
    }

    const Alumni = localStorage.getItem("isAlumni");
    console.log("✌️Alumni --->", Alumni);

    if (Alumni !== "true") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (token) {
      GetDepartmentList();
      GetHelpDesk();
    }
  }, [token]);

  const GetHelpDesk = () => {
    axios
      .get(`${BaseURL}/create_ticket/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFixedFormData(response.data);
      })
      .catch((error) => {
        console.log("❌error --->", error);
      });
  };
  console.log("fixedFormData", fixedFormData);

  const GetDepartmentList = () => {
    axios
      .get(`${BaseURL}/retrieve_ticket_category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategoryTicket(response.data?.results);
      })
      .catch((error) => {
        console.log("❌error --->", error);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationRules = {
      category: { required: true },
      content: { required: true },
    };

    const isValid = validateForm(formData, validationRules, setErrMsg);

    if (!isValid) {
      console.log("Validation errors:", errMsg);
      return;
    }

    const Body = {
      category: formData.category,
      content: formData.content,
      priority: "Low",
    };

    console.log("Body", Body);

    try {
      const response = await axios.post(`${BaseURL}/create_ticket/`, Body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✌️response --->", response);
      message.success(response.data.message);
      router.push("/help-desk/alumni-tickets");
      setFormData({
        category: "",
        content: "",
      });
      setErrMsg({});
    } catch (error) {
      console.log("❌error --->", error);
      message.error(error.response.data.message);
    }
  };

  const CategoryOptions = categoryTicket.map((cou) => ({
    value: cou.id,
    label: cou.category,
  }));


  return (
    <div className={`rbt-contact-address `}>
      <div className="container section-pad">
        <div className="row mb-4 justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between ">
              <h5>Alumni Help Desk</h5>
              <Link
                className="rbt-btn btn-gradient radius-round sm-btn"
                href="/help-desk/alumni-tickets"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="form-wrapper">
              <div className="rbt-contact-form contact-form-style-1 max-width-auto">
                <form
                  id="contact-form"
                  method="POST"
                  action="mail.php"
                  className="rainbow-dynamic-form max-width-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="form-grid">
                    {/* Left Column */}
                    <div className="form-group">
                      <FormField
                      label="Name"
                        placeholder="Name"
                        type="text"
                        value={fixedFormData.full_name}
                        // className="applicant-input"
                        required={true}
                        disabled={true}
                      />
                      <span className="focus-border"></span>
                    </div>

                    <div className="form-group">
                      <FormField
                         label="Contact Email"
                        type="email"
                        value={fixedFormData.email}
                        // className="applicant-input"
                        required={true}
                        disabled={true}
                      />
                      <span className="focus-border"></span>
                    </div>

                    <div className="form-group">
                      <FormField
                       label="Contact Number"
                        type="tel"
                        value={fixedFormData.contact}
                        // className="applicant-input"
                        required={true}
                        disabled={true}
                      />
                      <span className="focus-border"></span>
                    </div>

                    <div className="form-group">
                      <FormField
                        label="Category"
                        type="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={errMsg.category}
                        // className="applicant-input"
                        options={CategoryOptions}
                        required={true}
                      />
                      <span className="focus-border"></span>
                    </div>

                    <div className="form-group">
                      <FormField
                        label="Content"
                        type="textarea"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        error={errMsg.content}
                        required={true}
                      />
                      <span className="focus-border"></span>
                    </div>


                    
                  </div>

                  <div className="form-group w-100">
                      <FormField
                        placeholder="Job Description"
                        type="textarea"
                        // className="file-input"
                        name="job_description"
                        value={formData.job_description}
                        onChange={(e) => handleChange(e)}
                        error={errMsg.job_description}
                        required={true}
                      />
                    </div>

                  {/* Submit */}
                  <div className="form-submit-group">
                    <button
                      name="submit"
                      type="submit"
                      id="submit"
                      className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
                    >
                      <span className="icon-reverse-wrapper">
                        <span className="btn-text">Submit</span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                        <span className="btn-icon">
                          <i className="feather-arrow-right"></i>
                        </span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDeskFormMain;
