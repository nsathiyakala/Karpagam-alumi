import FormField from "@/commonComponents/FormFields";
import Models from "@/imports/models.import";
import { objectToFormData, useSetState } from "@/utils/commonFunction.utils";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import { message, Modal } from "antd";
import { GENDER } from "@/utils/constant.utils";

const Register = (props) => {
  const { updateStep } = props;

  const fileInputRef = useRef(null);
  
  const [state, setState] = useSetState({
    email: "",
    confrmModelOpen: false,
    confrmModelOpen: false,
    proofModelOpen: false,
  });

  useEffect(() => {
    getCourse();
    getSalutation();
    getBatch();
  }, []);

  const getCourse = async () => {
    try {
      const res = await Models.masters.course();
      const CourseOption = res?.results?.map((cou) => ({
        value: cou.course_id,
        label: cou.title,
      }));
      setState({ courseList: CourseOption, hasCourseLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const getSalutation = async () => {
    try {
      const res = await Models.masters.salutation();
      const SalutationOption = res?.results?.map((sal) => ({
        value: sal.salutation_id,
        label: sal.salutation_name,
      }));
      setState({ salutationList: SalutationOption });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const getBatch = async () => {
    try {
      const res = await Models.masters.batch(1);
      const BatchOption = res?.results?.map((bat) => ({
        value: bat.batch_id,
        label: bat.title,
      }));

      setState({ batchList: BatchOption, hasBatchLoadMore: res?.next });
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await Models.auth.register({ email: state.email });
      updateStep(res?.member_id,state.email);
    } catch (error) {
      console.log("✌️errorsddsf --->", error);
      if (error?.error == "Email not found in our records") {
        console.log("✌️records --->");
        setState({ confrmModelOpen: true, proofModelOpen: false });
      }else{
        message.error(error?.error)
      }
    }
  };

  const submitProof = async (e) => {
    try {
      e.preventDefault();

      const body = {
        salutation: state.salutation?.value,
        gender: state.salutation?.value,
        profile_picture: state.profile_picture,
        batch: state.batch?.value,
        course: state.course?.value,
        mobile_no: state.mobile_no,
        email: state.email,
        file: state.file,
        register_no: state.register_no,
      };
      const formData = objectToFormData(body);
      const res = await Models.auth.newMemberProof(formData);
      message.success(res.message);
      setState({ proofModelOpen: false });
    } catch (error) {
      message.error(error?.error);
      setState({ proofModelOpen: false });
      console.log("✌️error --->", error);
    }
  };

  const batchListLoadMore = async () => {
    try {
      if (state.hasBatchLoadMore) {
        const res = await Models.masters.batch(state.currenBatchPage + 1);
        const BatchOption = res?.results?.map((bat) => ({
          value: bat.batch_id,
          label: bat.title,
        }));
        setState({
          currenBatchPage: state.currenBatchPage + 1,
          hasBatchLoadMore: res.next,
          batchList: [...state.batchList, ...BatchOption],
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
        const CourseOption = res?.results?.map((cou) => ({
          value: cou.course_id,
          label: cou.title,
        }));
        setState({
          currenCoursePage: state.currenCoursePage + 1,
          hasCourseLoadMore: res.next,
          courseList: [...state.courseList, ...CourseOption],
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setState({ [name]: files[0] });
    } else {
      setState({ [name]: value });
    }
    setState({ errMsg: { ...state.errMsg, [name]: "" } });
  };

  return (
    <>
      <div className="col-lg-6">
        <div className="rbt-contact-form contact-form-style-1 max-width-auto">
          <h3 className="title">Register</h3>
          <form className="max-width-auto" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-group">
              <FormField
                placeholder="Email address *"
                type="text"
                name="email"
                value={state.email}
                onChange={handleChange}
                error={state.errMsg?.email}
                required={true}
              />
              <span className="focus-border"></span>
            </div>

            {/* <div className="form-group">
              <input
                name="register_user"
                type="text"
                placeholder="Username *"
              />
              <span className="focus-border"></span>
            </div>

            <div className="form-group">
              <input
                name="register_password"
                type="password"
                placeholder="Password *"
              />
              <span className="focus-border"></span>
            </div>

            <div className="form-group">
              <input
                name="register_conpassword"
                type="password"
                placeholder="Confirm Password *"
              />
              <span className="focus-border"></span>
            </div> */}

            <div className="form-submit-group">
              <button
                type="submit"
                className="rbt-btn btn-md btn-gradient hover-icon-reverse w-100"
              >
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">Register</span>
                  <span className="btn-icon">
                    <i className="feather-arrow-right"></i>
                  </span>
                  <span className="btn-icon">
                    <i className="feather-arrow-right"></i>
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-5 text-center">
              <p>
                Already have an account? <Link href={"/login"}>Login</Link>
              </p>
            </div>
          </form>
        </div>
        <Modal
          title="Email not found in our records"
          open={state.confrmModelOpen}
          footer={false}
          onOk={() =>
            setState({ confrmModelOpen: false, proofModelOpen: true })
          }
          onCancel={() => setState({ confrmModelOpen: false })}
          width={300}
        >
          <div>
            <button
              className="rbt-btn btn-md btn-gradient hover-icon-reverse w-80"
              onClick={() =>
                setState({ confrmModelOpen: false, proofModelOpen: true })
              }
            >
              Click Here
            </button>
          </div>
        </Modal>

        <Modal
          title="Submit Proof of Graduation"
          open={state.proofModelOpen}
          footer={false}
          onOk={() => setState({ proofModelOpen: false })}
          onCancel={() => setState({ proofModelOpen: false })}
          style={{ width: "200px" }}
        >
          <div>
            <form onSubmit={submitProof}>
              <div className="form-group mt-3">
                <FormField
                  type="loadMoreSelect"
                  name="salutation"
                  label="Salutation"
                  // className={"applicant-input"}
                  onChange={(value) => {
                    setState({ salutation: value });
                  }}
                  value={state.salutation}
                  options={state.salutationList}
                  error={state.errMsg?.salutation}
                  required
                  loadMore={() => {}}
                  className="applicant-input"
                />
              </div>

              <div className="form-group mt-3">
                <FormField
                  type="loadMoreSelect"
                  name="Gender"
                  label="Gender"
                  onChange={(value) => {
                    setState({ gender: value });
                  }}
                  value={state.gender}
                  options={GENDER}
                  error={state.errMsg?.gender}
                  required
                  loadMore={() => {}}
                  className="applicant-input"
                />
              </div>

              <div className="form-group mt-3">
                <FormField
                  placeholder="profile_picture"
                  type="file"
                  name="profile_picture"
                  onChange={handleChange}
                  value={state.profile_picture}
                  error={state.errMsg?.profile_picture}
                  className="applicant-input"
                />
              </div>
              <div className="form-group mt-3">
                <FormField
                  type="loadMoreSelect"
                  name="batch"
                  label="Batch"
                  onChange={(value) => {
                    setState({ batch: value });
                  }}
                  value={state.batch}
                  options={state.batchList}
                  error={state.errMsg?.batch}
                  required
                  loadMore={() => batchListLoadMore()}
                />
              </div>
              <div className="form-group mt-3">
                <FormField
                  type="loadMoreSelect"
                  name="course"
                  label="Course"
                  onChange={(value) => {
                    setState({ course: value });
                  }}
                  value={state.course}
                  options={state.courseList}
                  error={state.errMsg?.course}
                  required
                  loadMore={() => courseListLoadMore()}
                />
              </div>

              <div className="form-group">
                <FormField
                  placeholder="Mobile No"
                  type="number"
                  name="mobile_no"
                  onChange={handleChange}
                  value={state.mobile_no}
                  error={state.errMsg?.mobile_no}
                  required={true}
                />
                <span className="focus-border"></span>
              </div>

              <div className="form-group">
                <FormField
                  placeholder="Email address *"
                  type="text"
                  name="email"
                  onChange={handleChange}
                  value={state.verifyEmail}
                  error={state?.errMsg?.verifyEmail}
                  required={true}
                />
                <span className="focus-border"></span>
              </div>
              {/* </div> */}
              <div className="form-group mt-3 ">
                <FormField
                  placeholder="file (Proof of Graduation)"
                  className="applicant-input"
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  value={state.file}
                  onChange={handleChange}
                  error={state?.errMsg?.file}
                  required={true}
                />
              </div>

              <div className="form-group mt-3">
                <FormField
                  placeholder="Register No"
                  type="text"
                  name="register_no"
                  onChange={handleChange}
                  value={state.register_no}
                  error={state.errMsg?.register_no}
                  required={true}
                />
                <span className="focus-border"></span>
              </div>

              <div className="form-group message-btn mt-3 w-100">
                <button
                  type="submit"
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
        </Modal>
      </div>
    </>
  );
};

export default Register;
