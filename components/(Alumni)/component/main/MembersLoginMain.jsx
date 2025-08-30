import React, { useEffect } from "react";

import MembersLoginCard from "./MembersLoginCard";
import Link from "next/link";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { memberType, registeredMember } from "@/utils/constant.utils";
import Models from "@/imports/models.import";
import { objIsEmpty, useSetState } from "@/utils/commonFunction.utils";
import useDebounce from "@/commonComponents/useDebounce";
import { usePathname } from "next/navigation";
import FormField from "@/commonComponents/FormFields";
import { TeamData } from "@/utils/constant.utils";
import Image from "next/image";
import Pagination from "@/commonComponents/Pagination";




const MembersLoginMain = () => {
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();

  const [state, setState] = useSetState({
    memberList: [],
    batchList: [],
    roleList: [],
    courseList: [],
    departmentList: [],
    skillDropdownList: [],
    industryList: [],
    institutionList: [],
    locationList: [],
    total: 0,
    currentPage: 1,
    search: "",
    roleList: [],
    member_type: null,
    filterLoading: false,
    currenBatchPage: 1,
    hasBatchLoadMore: null,
    currenCoursePage: 1,
    hasCourseLoadMore: null,
    currenRolePage: 1,
    hasRoleLoadMore: null,
    currenDepartmentPage: 1,
    hasDepartmentLoadMore: null,
    currenSkillPage: 1,
    hasSkillLoadMore: null,
    currenIndustryPage: 1,
    hasIndustryLoadMore: null,
    currenInstitutionPage: 1,
    hasInstitutionLoadMore: null,
    currenLocationPage: 1,
    hasLocationLoadMore: null,
  });

  const pathname = usePathname();

  const debouncedSearch = useDebounce(state.search);

  useEffect(() => {
    roleList();
    locationList();
    institution();
    skillList();
    industryList();
    department();
    course();
    batch();
  }, []);

  useEffect(() => {
    const body = bodyData();
    if (!objIsEmpty(body)) {
      filterData(1);
    } else {
      memberList(1);
    }
  }, [debouncedSearch]);

  const memberList = async (page) => {
    try {
      setState({ pageLoading: true });
      const res = await Models.member.list(page);
      setState({
        memberList: res.results,
        currentPage: page,
        next: res?.next,
        prev: res?.previous,
        refresh: false,
        moreLoading: false,
        loading: false,
        total: res?.count,
        pageLoading: false,
      });
    } catch (error) {
      setState({ pageLoading: false });

      console.log("✌️error --->", error);
    }
  };

  const filterData = async (page) => {
    try {
      setState({ filterLoading: true });
      const body = bodyData();

      const res = await Models.member.filter(page, body);
      console.log("filterData --->", res);
      setState({
        memberList: res.results,
        currentPage: page,
        next: res?.next,
        prev: res?.previous,
        refresh: false,
        moreLoading: false,
        loading: false,
        total: res?.count,
        filterLoading: false,
      });
    } catch (error) {
      setState({ filterLoading: false });

      console.log("✌️error --->", error);
    }
  };

  const roleList = async () => {
    try {
      const res = await Models.job.roleList();
      const dropdown = setDropdownData(res?.results, "role");

      console.log("dropdown", dropdown);

      setState({ roleList: dropdown });
      setState({ hasRoleLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const locationList = async () => {
    try {
      setState({ loading: true });
      const res = await Models.job.locationList();
      const dropdown = setDropdownData(res?.results, "location");

      console.log("initial location res", res);

      setState({
        locationList: dropdown,
        loading: false,
        hasLocationLoadMore: res?.next,
      });
    } catch (error) {
      setState({ loading: false });
      console.log("✌️error --->", error);
    }
  };

  const institution = async () => {
    try {
      setState({ loading: true });
      const res = await Models.masters.institutions();
      const dropdown = setDropdownData(res?.results, "title");
      setState({
        institutionList: dropdown,
        hasInstitutionLoadMore: res?.next,
      });
    } catch (error) {
      setState({ loading: false });

      console.log("✌️error --->", error);
    }
  };

  const industryList = async () => {
    try {
      const res = await Models.job.industryList();

      const dropdown = setDropdownData(res?.results, "title");
      console.log("industry dd", dropdown);

      setState({ industryList: dropdown, hasIndustryLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const skillList = async () => {
    try {
      setState({ loading: true });

      const res = await Models.job.skillList();
      const dropdown = res?.results?.map((item) => ({
        value: item?.skill_id,
        label: item.skill,
      }));
      setState({
        skillDropdownList: dropdown,
        loading: false,
        hasSkillLoadMore: res?.next,
      });
    } catch (error) {
      setState({ loading: false });

      console.log("✌️error --->", error);
    }
  };

  const batch = async () => {
    try {
      setState({ loading: true });
      const res = await Models.masters.batch();
      const dropdown = res?.results?.map((item) => ({
        value: item?.batch_id,
        label: item?.title,
      }));
      setState({
        batchList: dropdown,
        loading: false,
        hasBatchLoadMore: res?.next,
      });
    } catch (e) {
      setState({ loading: false });
      console.log(e);
    }
  };

  const course = async () => {
    try {
      setState({ loading: true });
      const res = await Models.masters.course();

      const dropdown = res?.results?.map((item) => ({
        value: item?.course_id,
        label: item?.title,
      }));
      setState({
        courseList: dropdown,
        loading: false,
        hasCourseLoadMore: res?.next,
      });
    } catch (e) {
      setState({ loading: false });
      console.log(e);
    }
  };

  const department = async () => {
    try {
      setState({ loading: true });
      const res = await Models.masters.department();

      const dropdown = res?.results?.map((item) => ({
        value: item?.department_id,
        label: item?.short_name,
      }));
      setState({
        departmentList: dropdown,
        loading: false,
        hasDepartmentLoadMore: res?.next,
      });
    } catch (e) {
      setState({ loading: false });
      console.log(e);
    }
  };

  const errorNotification = (error) => {
    messageApi.open({
      type: "error",
      content: error || "An error occurred. Please try again.",
    });
  };

  const handlePageChange = (number) => {
    memberList(number);
    setState({ currentPage: number });
    window.scrollTo({ top: 0, behavior: "smooth" });

    return number;
  };

  const filterSubmit = async () => {
    try {
      setState({ filterLoading: true });
      const body = bodyData();

      console.log("body", body);

      if (objIsEmpty(body)) {
        // errorNotification("Please select at least one filter.");
        setState({ filterLoading: false });
        memberList(1);

        return;
      }
      const res = await Models.member.filter(1, body);
      console.log("filterData --->", res);
      setState({
        memberList: res.results,
        currentPage: 1,
        next: res?.next,
        prev: res?.previous,
        refresh: false,
        moreLoading: false,
        loading: false,
        total: res?.count,
        filterLoading: false,
      });
    } catch (error) {
      setState({ filterLoading: false });
      errorNotification(error?.message || "An error occurred while filtering.");
    }
  };

  console.log("state.member_type", state.member_type);

  const bodyData = () => {
    const body = {};
    // member_type,batch,course,role,department,skills,industry,institution,location,dob,registered

    if (state.search) {
      body.search = state.search;
    }
    if (state.member_type) {
      body.member_type = state.member_type;
    }
    if (state.member_type == "Alumni") {
      if (state.batch) {
        body.batch = state.batch.value;
      }
      if (state.course) {
        body.course = state.course.value;
      }
    }
    if (state.role) {
      body.role = state.role.value;
    }
    if (state.department) {
      body.department = state.department.value;
    }
    if (state.skills) {
      body.skills = state.skills.value;
    }
    if (state.industry) {
      body.industry = state.industry.value;
    }
    if (state.institution) {
      body.institution = state.institution.value;
    }
    if (state.location) {
      body.location = state.location.value;
    }
    if (state.dob) {
      body.dob = state.dob;
    }
    if (state.registered) {
      body.registered = state.registered == "Registered" ? true : false;
    }
    return body;
  };

  const clearFilter = async () => {
    try {
      setState({
        registered: "",
        dob: "",
        location: "",
        institution: "",
        industry: "",
        skills: "",
        department: "",
        course: "",
        batch: "",
        role: "",
        member_type: "",
        search: "",
      });
      await memberList(1);
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const memberTypeOption = memberType?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  const RegisterdOption = registeredMember.map((item) => ({
    label: item?.label,
    value: item?.name,
  }));

  console.log("✌️state.member_type --->", state);

  const batchListLoadMore = async () => {
    try {
      if (state.hasBatchLoadMore) {
        const res = await Models.masters.batch(state.currenBatchPage + 1);
        const BatchOption = res?.results?.map((bat) => ({
          value: bat.batch_id,
          label: bat.title,
        }));
        setState({
          batchList: [...state.batchList, ...BatchOption],
          currenBatchPage: state.currenBatchPage + 1,
          hasBatchLoadMore: res.next,
        });
      } else {
        setState({
          batchList: state.batchList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const courseListLoadMore = async () => {
    try {
      if (state.hasCourseLoadMore) {
        const res = await Models.masters.course(state.currenCoursePage + 1);
        const CourseOption = res?.results?.map((bat) => ({
          value: bat.course_id,
          label: bat.title,
        }));
        setState({
          courseList: [...state.courseList, ...CourseOption],
          currenCoursePage: state.currenCoursePage + 1,
          hasCourseLoadMore: res.next,
        });
      } else {
        setState({
          courseList: state.courseList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const roleListLoadMore = async () => {
    try {
      if (state.hasRoleLoadMore) {
        const res = await Models.job.roleList(state.currenRolePage + 1);
        // const RoleOption = res?.results?.map((role) => ({
        //   value: role.batch_id,
        //   label: role.title,
        // }));
        const RoleOption = setDropdownData(res?.results, "role");

        setState({
          roleList: [...state.roleList, ...RoleOption],
          currenRolePage: state.currenRolePage + 1,
          hasRoleLoadMore: res.next,
        });
      } else {
        setState({
          roleList: state.roleList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const departmentListLoadMore = async () => {
    try {
      if (state.hasDepartmentLoadMore) {
        const res = await Models.masters.department(
          state.currenDepartmentPage + 1
        );
        const DepartmentOption = res?.results?.map((deparment) => ({
          value: deparment.department_id,
          label: deparment.short_name,
        }));

        setState({
          deparmentList: [...state.deparmentList, ...DepartmentOption],
          currenDeparmentPage: state.currenDeparmentPage + 1,
          hasDeparmentLoadMore: res.next,
        });
      } else {
        setState({
          deparmentList: state.deparmentList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
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

        setState({
          skillDropdownList: [...state.skillDropdownList, ...SkillOption],
          currenSkillPage: state.currenSkillPage + 1,
          hasSkillLoadMore: res.next,
        });
      } else {
        setState({
          skillDropdownList: state.skillDropdownList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const industryListLoadMore = async () => {
    try {
      if (state.hasIndustryLoadMore) {
        const res = await Models.job.industryList(state.currenIndustryPage + 1);
        // const IndustryOption = res?.results?.map((item) => ({
        //   value: item.skill_id,
        //   label: item.skill,
        // }));
        const IndustryOption = setDropdownData(res?.results, "title");

        setState({
          industryList: [...state.industryList, ...IndustryOption],
          currenIndustryPage: state.currenIndustryPage + 1,
          hasIndustryLoadMore: res.next,
        });
      } else {
        setState({
          industryList: state.industryList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const institutionListLoadMore = async () => {
    try {
      if (state.hasInstitutionLoadMore) {
        const res = await Models.masters.institutions(
          state.currenInstitutionPage + 1
        );

        const InstitutionOption = setDropdownData(res?.results, "title");

        setState({
          institutionList: [...state.institutionList, ...InstitutionOption],
          curreninstitutionPage: state.curreninstitutionPage + 1,
          hasinstitutionLoadMore: res.next,
        });
      } else {
        setState({
          institutionList: state.institutionList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const locationListLoadMore = async () => {
    console.log("state.hasLocationLoadMore)", state.hasLocationLoadMore);

    try {
      if (state.hasLocationLoadMore) {
        const res = await Models.job.locationList(state.currenLocationPage + 1);
        // const InstitutionOption = res?.results?.map((item) => ({
        //   value: item.skill_id,
        //   label: item.skill,
        // }));
        const LocationOption = setDropdownData(res?.results, "location");
        console.log("loadmore location res", res);

        setState({
          locationList: [...state.locationList, ...LocationOption],
          currenlocationPage: state.currenlocationPage + 1,
          hasLocationLoadMore: res.next,
        });
      } else {
        setState({
          locationList: state.locationList,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  console.log("locationList after", state.locationList);

  return (
    <div className="rbt-dashboard-area section-pad">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-11 col-xl-10">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row g-5">
                    <div className="col-lg-3 d-sidebar">
                      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                        <div className="inner">
                          <div className="content-item-content">
                            <div className="rbt-default-sidebar-wrapper">
                              <nav className="mainmenu-nav">
                                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="select"
                                        onChange={(e) =>
                                          setState({
                                            member_type: e.target.value,
                                          })
                                        }
                                        name="member_type"
                                        value={state.member_type}
                                        options={memberTypeOption}
                                        placeholder={"Member Type"}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        onChange={(e) => setState({ batch: e })}
                                        name="batch"
                                        value={state.batch}
                                        options={state.batchList}
                                        placeholder={"Batch"}
                                        loadMore={() => batchListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        name="course"
                                        value={state.course}
                                        onChange={(e) =>
                                          setState({ course: e })
                                        }
                                        options={state.courseList}
                                        placeholder={"Course"}
                                        loadMore={() => courseListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        name="role"
                                        value={state.role}
                                        onChange={(e) => setState({ role: e })}
                                        options={state.roleList}
                                        placeholder={"role"}
                                        loadMore={() => roleListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        name="department"
                                        value={state.department}
                                        onChange={(e) =>
                                          setState({ department: e })
                                        }
                                        options={state.departmentList}
                                        placeholder={"Department"}
                                        loadMore={() =>
                                          departmentListLoadMore()
                                        }
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        name="skills"
                                        value={state.skills}
                                        onChange={(e) =>
                                          setState({ skills: e })
                                        }
                                        options={state.skillDropdownList}
                                        placeholder={"Skills"}
                                        loadMore={() => skillListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        onChange={(e) =>
                                          setState({ industry: e })
                                        }
                                        name="industry"
                                        value={state.industry}
                                        options={state.industryList}
                                        placeholder={"Industry"}
                                        loadMore={() => industryListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        onChange={(e) =>
                                          setState({ institution: e })
                                        }
                                        name="institution"
                                        value={state.institution}
                                        options={state.institutionList}
                                        placeholder={"Institution"}
                                        loadMore={() =>
                                          institutionListLoadMore()
                                        }
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        onChange={(e) =>
                                          setState({ location: e })
                                        }
                                        name="location"
                                        value={state.location}
                                        options={state.locationList}
                                        placeholder={"Location"}
                                        loadMore={() => locationListLoadMore()}
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="date"
                                        onChange={(e) =>
                                          setState({ dob: e.target.value })
                                        }
                                        name="dob"
                                        value={state.dob}
                                        placeholder={"Date of Birth"}
                                        className="date-field"
                                      />
                                    </a>
                                  </li>

                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`w-100 ${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      <FormField
                                        type="select"
                                        name="registered"
                                        placeholder={"Member Status"}
                                        value={state.registered}
                                        onChange={(e) =>
                                          setState({
                                            registered: e.target.value,
                                          })
                                        }
                                        options={RegisterdOption}
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </nav>

                              

                              <div
                                className=" d-flex flex-wrap mt-5"
                                style={{ columnGap: "10px", rowGap: "8px" }}
                              >
                                <Link
                                  className="rbt-btn btn-gradient radius-round sm-btn"
                                  href="#"
                                  onClick={filterSubmit}
                                >
                                  Filter
                                </Link>
                                <Link
                                  className="rbt-btn btn-border-gradient radius-round sm-btn"
                                  href="#"
                                  onClick={clearFilter}
                                >
                                  Clear all
                                </Link>
                              </div>

                              {/* <div className="section-title mt--40 mb--20">
                <h6 className="rbt-title-style-2">User</h6>
              </div>

              <nav className="mainmenu-nav">
                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                  {SidebarData &&
                    SidebarData.siderbar.slice(7, 10).map((data, index) => (
                      <li key={index}>
                        <a
                          href={data.link}
                          className={`${
                            pathname === data.link ? "active" : ""
                          }`}
                        >
                          <i className={data.icon} />
                          <span>{data.text}</span>
                        </a>
                      </li>
                    ))}
                </ul>
              </nav> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-9">
                      <div className="rbt-video-area bg-color-white overflow-hidden">
                        <div className="container">
                          <div className="row row--15 gy-5">
                            {state.memberList &&
                              state.memberList.map((member, index) => (
                                <div
                                  className="col-lg-3 col-md-6 col-sm-6 col-12 "
                                  key={index}
                                >
                                  {/* {data.details.map((item, innerIndex) => ( */}
                                  <div className="team">
                                    {member?.profile_picture ? (
                                      <Link
                                        className="rbt-team-thumbnail w-100"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#exampleModal${index}`}
                                      >
                                        <div className="thumbnail">
                                          <img
                                            // src={member?.profile_picture}
                                            src="/images/team/team-07.jpg"
                                            width={415}
                                            height={555}
                                            priority
                                            alt="Blog Images"
                                          />
                                        </div>
                                      </Link>
                                    ) : (
                                      <Link
                                        className="rbt-team-thumbnail w-100"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#exampleModal${index}`}
                                      >
                                        <div className="thumbnail">
                                          <img
                                            // src={member?.profile_picture}
                                            src="/images/team/team-07.jpg"
                                            width={415}
                                            height={555}
                                            priority
                                            alt="Blog Images"
                                          />
                                        </div>
                                      </Link>
                                    )}

                                    <div className="content">
                                      <h4 className="title mb-3">
                                        {member?.name == null ||
                                        member?.name == " " ||
                                        member?.name == "" ? (
                                          <Link href={`/members/${member?.id}`}>
                                            {member?.email}
                                          </Link>
                                        ) : (
                                          <Link href={`/members/${member?.id}`}>
                                            {member?.name}
                                          </Link>
                                        )}
                                      </h4>
                                      <p className="designation">
                                        {member?.course}
                                      </p>
                                    </div>
                                    {/* <ul className="social-icon">
                                        <li>
                                          <Link href="#">
                                            <i className="fab fa-facebook-f"></i>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="#">
                                            <i className="fab fa-linkedin-in"></i>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link href="#">
                                            <i className="fab fa-twitter"></i>
                                          </Link>
                                        </li>
                                      </ul> */}
                                  </div>
                                  {/* ))} */}
                                </div>
                              ))}
                          </div>

                          {state.memberList?.length > 0 && (
                            <div>
                              <div
                                className="mb-20 "
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Pagination
                                  activeNumber={handlePageChange}
                                  totalPage={state.total}
                                  currentPages={state.currentPage}
                                />
                              </div>
                            </div>
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
  );
};

export default MembersLoginMain;
