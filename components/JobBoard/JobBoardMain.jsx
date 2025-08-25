import React, { useEffect, useState } from "react";
import FormField from "@/commonComponents/FormFields";

import MembersLoginCard from "../MembersLoginCard";
import SideBarLogin from "../KITSidebar/SideBarMembers";
import JobBoardTable from "./JobBoardTable";
import SideBarJob from "../KITSidebar/SideBarJob";
import { useRouter } from "next/navigation";
import { useSetState } from "@/utils/commonFunction.utils";
import { message, Modal } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { BaseURL } from "@/utils/BaseUrl";

const JobBoardMain = () => {
  const { confirm } = Modal;
  const router = useRouter();
  const [openSubMenuId, setOpenSubMenuId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [normelUserFilter, setNormelUserFilter] = useState([]);
  const [AdminDataLists, setAdminDataLists] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    industry: "",
    role: "",
    location: "",
    post_type: "",
  });

  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAlumniManager, setIsAlumniManager] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);
  const [isFatulty, setIsFatulty] = useState(false);
  const [myJobPost, setMyJobPosts] = useState([]);
  const [allUserFilterFinalDataList, setAllUserFilterFinalDataList] = useState(
    []
  );

  const [state, setState] = useSetState({
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

  useEffect(() => {
    const Token = localStorage.getItem("token");
    setToken(Token);
    if (!Token) {
      router.push("/login");
    }

    const Admin = localStorage.getItem("isAdmin");
    setIsAdmin(Admin);

    const AlumniManager = localStorage.getItem("isAlumniManager");
    setIsAlumniManager(AlumniManager);

    const Alumni = localStorage.getItem("isAlumni");
    setIsAlumni(Alumni);

    const Faculty = localStorage.getItem("isFaculty");
    setIsFatulty(Faculty);

    // if (Admin !== "true" && AlumniManager !== "true") {
    //   router.push("/");
    // }
  }, []);

  useEffect(() => {
    if (token && (isAlumni == "true" || isFatulty == "true")) {
      GetJobs();
      GetDepartmentList();
      GetRoleList();
      getLocation();
      GetMyJobPosts();
    }
  }, [token, isAlumni, isFatulty]);

  useEffect(() => {
    if (token && (isAdmin == "true" || isAlumniManager == "true")) {
      getJobsAdmin();
      GetDepartmentList();
      GetRoleList();
      getLocation();
      GetMyJobPosts();
    }
  }, [token, isAdmin, isAlumniManager]);

  const GetJobs = () => {
    axios
      .get(`${BaseURL}/retrieve_job_post/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListOfPosts(response.data?.results);
        setNormelUserFilter(response.data?.results);
      })
      .catch((error) => {
        console.log("❌error --->", error);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  const getJobsAdmin = () => {
    axios
      .get(`${BaseURL}/retrieve_main_job_post/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAdminDataLists(response.data?.results);
        setFilteredData(response.data?.results);
      })
      .catch((error) => {
        console.log("❌error --->", error);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  const GetMyJobPosts = () => {
    axios
      .get(`${BaseURL}/my_job_post/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setAdminDataLists(response.data);
        // setFilteredData(response.data);
        setMyJobPosts(response.data?.results);
      })
      .catch((error) => {
        console.log("❌error --->", error);
      });
  };

  const GetDepartmentList = async () => {
    try {
      const res = await Models.job.industryList();

      const dropdown = setDropdownData(res?.results, "title");
      console.log("industry dd", dropdown);

      setDepartmentList(dropdown);
      setState({
        hasIndustryLoadMore: res?.next,
      });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const GetRoleList = async () => {
    try {
      const res = await Models.job.roleList();
      const dropdown = setDropdownData(res?.results, "role");

      console.log("dropdown", dropdown);

      setRoleList(dropdown);
      setState({ hasRoleLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const getLocation = async () => {
    try {
      setState({ loading: true });
      const res = await Models.job.locationList();
      const dropdown = setDropdownData(res?.results, "location");

      console.log("initial location res", res);

      setLocationList(dropdown);

      setState({ loading: false, hasLocationLoadMore: res?.next });
    } catch (error) {
      setState({ loading: false });
      console.log("✌️error --->", error);
    }
  };

  const handleSubMenuClick = (id) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

  const handleEditClick = (id) => {
    router.push(`/edit-a-job/${id}/`);
  };

  // Pagination Logic
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPagesForAdmin = Math.ceil(filteredData.length / itemsPerPage);
  const startIndexForAdmin = (currentPage - 1) * itemsPerPage;
  const currentDataForAdmin = filteredData.slice(
    startIndexForAdmin,
    startIndexForAdmin + itemsPerPage
  );

  const totalPagesForUser = Math.ceil(normelUserFilter.length / itemsPerPage);
  const startIndexForUser = (currentPage - 1) * itemsPerPage;
  const currentDataForUser = [];
  // normelUserFilter.slice(
  //   startIndexForUser,
  //   startIndexForUser + itemsPerPage
  // );

  const success = (successMsg) => {
    messageApi.open({
      type: "success",
      content:
        successMsg || "Success! Check your email for further instructions.",
    });
  };

  const errorNotification = (error) => {
    messageApi.open({
      type: "error",
      content: error || "An error occurred. Please try again.",
    });
  };

  const showDeleteConfirm = (post) => {
    confirm({
      title: post.is_active
        ? "Are you sure you want to InActive this Post?"
        : "Are you sure you want to Active this Post?",
      okText: post.is_active ? "InActive" : "Active",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setLoading(true);
        axios
          .put(
            `${BaseURL}/deactivate_job_post/${post.id}/`,
            {
              is_active: !post.is_active,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            success(response.data.message || "Operation successful!");
            getJobsAdmin(); // Refresh the job list
            setLoading(false);
          })
          .catch((error) => {
            errorNotification(
              error.response?.data?.error ||
                "An error occurred. Please try again."
            );
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleSearchFilter = (e) => {
    const value = e.target.value.toLowerCase();

    if (token) {
      if (value) {
        const filtered = AdminDataLists.filter(
          (post) =>
            post?.job_title?.toLowerCase().includes(value) ||
            post?.industry.toLowerCase().includes(value) ||
            post?.role?.toLowerCase().includes(value) ||
            post?.location.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(AdminDataLists); // Reset to original data if input is cleared
      }
    }
    {
      if (value) {
        const filtered = listOfPosts.filter(
          (post) =>
            post?.job_title?.toLowerCase().includes(value) ||
            post?.industry?.toLowerCase().includes(value) ||
            post?.role.toLowerCase().includes(value) ||
            post?.location.toLowerCase().includes(value) ||
            post?.post_type.toLowerCase().includes(value)
        );
        setNormelUserFilter(filtered);
      } else {
        setNormelUserFilter(listOfPosts); // Reset to original data if input is cleared
      }
    }
  };

  const handleFilterChange = (e) => {
    console.log("handleFilterChange e", e);

    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const industryOptions = departmentList.map((ind) => ({
    value: ind.id,
    label: ind.title,
  }));

  const roleOption = roleList.map((role) => ({
    value: role.id,
    label: role.role,
  }));

  const LocationOption = locationList.map((loc) => ({
    value: loc.location,
    label: loc.location,
  }));

  // const JobOption = jobTypeOption.map((job) => ({
  //   value: job.value,
  //   label: job.label,
  // }));

  const FilterIndutry = departmentList?.filter(
    (ind) => ind.id == allUserFilterFinalDataList.industry
  );

  const FilterRole = roleList?.filter(
    (role) => role.id == allUserFilterFinalDataList.role
  );

  const FilterLocation = locationList?.filter(
    (loc) => loc.location == allUserFilterFinalDataList.location
  );

  console.log("formData", formData);

  const bodyData = () => {
    const body = {};

    if (formData.industry) {
      body.industry = formData.industry.value;
    }
    if (formData.job_title) {
      body.job_title = formData.job_title;
    }
    if (formData.role) {
      body.role = formData.role.value;
    }
    if (formData.location) {
      body.location = formData.location.value;
    }
    if (formData.post_type) {
      body.post_type = formData.post_type;
    }
    return body;
  };

  const handleFiltersSubmit = (e) => {
    const body = bodyData();

    console.log("bodyData", body);

    e.preventDefault();

    if (isAdmin == "true" || isAlumniManager == "true") {
      axios
        .post(`${BaseURL}/main_filter_job/`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdminDataLists(response.data?.results);
          setFilteredData(response.data?.results);
          setListOfPosts(response.data?.results);
          setNormelUserFilter(response.data?.results);
          setAllUserFilterFinalDataList(formData);
          // setFormData({
          //   job_title: "",
          //   industry: "",
          //   role: "",
          //   location: "",
          //   post_type: "",
          // });
        })
        .catch((error) => {
          console.log("❌error --->", error);
        });
    } else if (isAlumni == "true" || isFatulty == "true") {
      axios
        .post(`${BaseURL}/filter_job/`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAllUserFilterFinalDataList(formData);
          setAdminDataLists(response.data?.results);
          setFilteredData(response.data?.results);
          setListOfPosts(response.data?.results);
          setNormelUserFilter(response.data?.results);
          // setFormData({
          //   job_title: "",
          //   industry: "",
          //   role: "",
          //   location: "",
          //   post_type: "",
          // });
        })
        .catch((error) => {
          console.log("❌error --->", error);
        });
    }
  };

  console.log("allUserFilterFinalDataList", allUserFilterFinalDataList);

  const handleClearFilter = () => {
    const Body = {
      job_title: "",
      industry: "",
      role: "",
      location: "",
      post_type: "",
    };

    if (isAdmin == "true" || isAlumniManager == "true") {
      axios
        .post(`${BaseURL}/main_filter_job/`, Body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdminDataLists(response.data?.results);
          setFilteredData(response.data?.results);
          setListOfPosts(response.data?.results);
          setNormelUserFilter(response.data?.results);

          setFormData({
            job_title: "",
            industry: "",
            role: "",
            location: "",
            post_type: "",
          });
          setAllUserFilterFinalDataList(Body);
        })
        .catch((error) => {
          console.log("❌error --->", error);
        });
    } else if (isAlumni == "true" || isFatulty == "true") {
      axios
        .post(`${BaseURL}/filter_job/`, Body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdminDataLists(response.data?.results);
          setFilteredData(response.data?.results);
          setListOfPosts(response.data?.results);
          setNormelUserFilter(response.data?.results);
          setFormData({
            job_title: "",
            industry: "",
            role: "",
            location: "",
            post_type: "",
          });
          setAllUserFilterFinalDataList(Body);
        })
        .catch((error) => {
          console.log("❌error --->", error);
        });
    }
  };

  const industryListLoadMore = async () => {
    try {
      if (state.hasIndustryLoadMore) {
        const res = await Models.job.industryList(state.currenIndustryPage + 1);

        const IndustryOption = setDropdownData(res?.results, "title");

        setDepartmentList([...departmentList, ...IndustryOption]);
        setState({
          currenIndustryPage: state.currenIndustryPage + 1,
          hasIndustryLoadMore: res.next,
        });
      } else {
        setDepartmentList(departmentList);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const roleListLoadMore = async () => {
    try {
      if (state.hasRoleLoadMore) {
        const res = await Models.job.roleList(state.currenRolePage + 1);
        // const IndustryOption = res?.results?.map((item) => ({
        //   value: item.skill_id,
        //   label: item.skill,
        // }));
        const RoleOption = setDropdownData(res?.results, "role");

        console.log("roleList", roleList);

        console.log("RoleOption", RoleOption);

        setRoleList([...roleList, ...RoleOption]);
        setState({
          currenRolePage: state.currenRolePage + 1,
          hasRoleLoadMore: res.next,
        });
      } else {
        setRoleList(roleList);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const locationListLoadMore = async () => {
    try {
      if (state.hasLocationLoadMore) {
        const res = await Models.job.locationList(state.currenLocationPage + 1);
        // const IndustryOption = res?.results?.map((item) => ({
        //   value: item.skill_id,
        //   label: item.skill,
        // }));
        const LocationOption = setDropdownData(res?.results, "location");

        console.log("roleList", locationList);

        console.log("RoleOption", LocationOption);

        setLocationList([...locationList, ...LocationOption]);
        setState({
          currenLocationPage: state.currenLocationPage + 1,
          hasLocationLoadMore: res.next,
        });
      } else {
        setRoleList(locationList);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="rbt-dashboard-area section-pad">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-11 col-xl-10">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row g-5">
                    <div className="col-lg-3">
                      <div className="rbt-default-sidebar sticky-top rbt-shadow-box rbt-gradient-border">
                        <div className="inner">
                          <div className="content-item-content">
                            <div className="rbt-default-sidebar-wrapper">
                              {/* <div className="section-title mb--20">
                <h6 className="rbt-title-style-2">Welcome, user</h6>
              </div> */}
                              <nav className="mainmenu-nav">
                                <ul className="dashboard-mainmenu rbt-default-sidebar-list">
                                  <li className="nav-item" role="presentation">
                                    <a
                                      className={`${
                                        pathname === "#" ? "active" : ""
                                      }`}
                                      href="#"
                                    >
                                      {/* <i className="feather-calendar" /> */}
                                      <FormField
                                        type="text"
                                        className="applicant-input"
                                        // onChange={(e) => handleFilterChange(e)}
                                        name="job_title"
                                        // value={formData.job_title}
                                        placeholder="Job Title"
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
                                      {/* <i className="feather-calendar" /> */}
                                      <FormField
                                        type="loadMoreSelect"
                                        className="member-dd"
                                        name="industry"
                                        placeholder={"Industry"}
                                        value={formData.industry}
                                        onChange={(e) => {
                                          setFormData({
                                            ...formData,
                                            industry: e,
                                          });
                                        }}
                                        options={departmentList}
                                        loadMore={() => industryListLoadMore()}
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </nav>

                              <div className="col-lg-12 d-flex gap-5 mt-5">
                                <Link
                                  className="rbt-btn btn-gradient radius-round sm-btn"
                                  href="#"
                                >
                                  Filter
                                </Link>
                                <Link
                                  className="rbt-btn btn-border-gradient radius-round sm-btn"
                                  href="#"
                                >
                                  Cancel
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
                      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
                        <div className="content">
                          <div className="section-title">
                            <h4 className="rbt-title-style-3">My Job List</h4>
                          </div>

                          <div className="rbt-dashboard-table table-responsive mobile-table-750">
                            <table className="rbt-table table table-borderless">
                              <thead>
                                <tr>
                                  <th>Job Title</th>
                                  <th>Industry</th>
                                  <th>Role</th>
                                  <th>N.Of Applicants</th>
                                  <th>Posted Date</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <th>
                                    <span className="b3">
                                      <Link href="#">
                                        Speaking Korean for Beginners
                                      </Link>
                                    </span>
                                  </th>
                                  <td>
                                    <span className="b3">
                                      <Link href="#">
                                        Speaking Korean for Beginners
                                      </Link>
                                    </span>
                                  </td>
                                  <td>
                                    <span className="b3">
                                      <Link href="#">
                                        Speaking Korean for Beginners
                                      </Link>
                                    </span>
                                  </td>
                                  <td>
                                    <span className="b3">
                                      <Link href="#">
                                        Speaking Korean for Beginners
                                      </Link>
                                    </span>
                                  </td>
                                  <td>
                                    <span className="b3">
                                      <Link href="#">
                                        Speaking Korean for Beginners
                                      </Link>
                                    </span>
                                  </td>
                                  <td>
                                    <div className="rbt-button-group justify-content-end">
                                      <Link
                                        className="rbt-btn btn-xs bg-primary-opacity radius-round"
                                        href="#"
                                        title="Edit"
                                      >
                                        <i className="feather-edit pl--0"></i>
                                      </Link>
                                      <Link
                                        className="rbt-btn btn-xs bg-color-danger-opacity radius-round color-danger"
                                        href="#"
                                        title="Delete"
                                      >
                                        <i className="feather-trash-2 pl--0"></i>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
  );
};

export default JobBoardMain;
