"use client";

import Separator from "@/components/Common/Separator";

import MobileMenu from "@/components/Header/MobileMenu";

import InstructorDashboardHeader from "@/components/Instructor/InstructorDashboardHeader";
import Context from "@/context/Context";
import Store from "@/redux/store";
import React, { useEffect, useState } from "react";

import { Provider } from "react-redux";

import KITHeader from "@/components/Header/KITHeader";
import KITFooter from "@/components/Footer/KITFooter";
import MasterDataSidebar from "@/components/(Alumni)/component/KITMaster/MasterDataSidebar";
import AdminMain from "@/components/(Alumni)/component/KITMaster/AdminMain";
import QuizAttempts from "@/components/Student/QuizAttempts";
import CommonTable from "@/components/(Alumni)/commonTable";
import {
  Dropdown,
  useSetState,
  validateForm,
} from "@/utils/commonFunction.utils";
import Models from "@/imports/models.import";
import { Modal, Select, Spin, Tooltip, message } from "antd";

import UserTable from "@/components/(Alumni)/component/Tables/userTable";
import FormField from "@/commonComponents/FormFields";
import PostJobForm from "@/components/(Alumni)/component/JobBoard/PostJobForm";
import BreadCrumb from "@/components/Common/BreadCrumb";
import CreateMemberForm from "@/components/(Alumni)/component/Member/createMember";

const CreateMember = () => {
  const { confirm } = Modal;

  const [errMsg, setErrMsg] = useState({});

  const [state, setState] = useSetState({
    currentPage: 1,
    next: null,
    previous: null,
    total: 0,
    btnLoading: false,
    loading: false,
    userList: [],
    group_ids: [],
    email: "",
    password: "",
  });

  useEffect(() => {
    userList(1);
    roleList();
  }, []);

  const userList = async (page) => {
    try {
      setState({ loading: true });
      const res = await Models.member.users(page);
      setState({
        userList: res?.results,
        currentPage: page,
        next: res?.next,
        previous: res?.previous,
        total: res?.count,
        loading: false,
      });
    } catch (error) {
      setState({ loading: false });
      console.log("✌️error --->", error);
    }
  };

  const roleList = async () => {
    try {
      const res = await Models.auth.roleList();
      const dropdown = Dropdown(res, "name");
      setState({
        roleList: dropdown,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const updateStatus = (approval) => {
    confirm({
      title: approval.is_active
        ? "Are you sure you want to InActive this Users?"
        : "Are you sure you want to Active this Users?",

      okText: approval.is_active ? "InActive" : "Active",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        confirmApproval(approval);
      },
      onCancel() {},
    });
  };

  const confirmApproval = async (approval) => {
    try {
      setState({ btnLoading: true });
      const body = {
        is_active: !approval.is_active,
      };
      let res = await Models.member.updateUserStatus(approval.id, body);
      message.success(res.message || "Operation successful!");
      userList(state.currentPage);
      setState({ btnLoading: false });
    } catch (err) {
      setState({ btnLoading: false });
      console.log("err", err);
    }
  };

  const updateRole = async (e) => {
    e.preventDefault();

    try {
      if (state.group_ids?.length === 0) {
        message.error("Please select at least one group."); // Display error message
        return;
      }
      setState({ btnLoading: true });
      const body = {
        group_ids: state.group_ids,
        id: state.userId,
      };
      let res = await Models.member.updateUserRole(body);
      message.success(res.message || "Operation successful!");
      setState({ btnLoading: false, isOpen: false });
      userList(state.currentPage);
    } catch (err) {
      setState({ btnLoading: false });
      console.log("err", err);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const validationRules = {
        email: { required: true },
        password: { required: true },
      };
      const body = {
        email: state.email,
        password: state.password,
      };

      const isValid = validateForm(body, validationRules, setErrMsg);
      console.log("✌️isValid --->", isValid);
      if (!isValid) {
        return;
      }
      let res = await Models.member.create_user(body);
      message.success(res.message || "User created successful!");
      setState({ isOpen1: false });
      userList(1);
    } catch (err) {
      console.log("err", err);
    }
  };

  const updateUser = (item) => {
    setState({
      isOpen: true,
      userId: item.id,
      group_ids: item.groups.map((group) => ({
        value: group.id,
        label: group.name,
      })),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ [name]: value });
  };

  return (
    <>
      <Provider store={Store}>
        <Context>
          <MobileMenu />
          <KITHeader headerSticky="rbt-sticky" headerType="" />

          <BreadCrumb title="New Member" text="New-Member" />

          <CreateMemberForm />
          <Separator />
          <KITFooter />
        </Context>
      </Provider>
    </>
  );
};

export default CreateMember;
