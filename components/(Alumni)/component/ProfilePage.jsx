import Image from "next/image";

const ProfilePage = () => {
  return (
    <div className="container">
      <div className="row mb--50">
        <div className="col-lg-12">
          <div className="section-title text-center">
            <span className="subtitle bg-pink-opacity">Our Courses</span>
            <h2 className="title">Tuition & Program Details</h2>
          </div>
        </div>
      </div>

      <div className="row g-5 align-items-start justify-content-center">
        {/* Accordion Section */}

        <div className="col-lg-4 ">
          {/* <div className="thumbnail">
            <Image
              className="radius-6"
              src="/images/course-thumbnail.jpg"
              width={526}
              height={644}
              alt="Course Thumbnail"
            />
          </div> */}

          <div className="custom-profile-card">
            <div className="custom-profile-header">
              <img
                src="/images/profile-photo.jpg"
                alt="Profile"
                className="custom-profile-image"
              />
              <div className="custom-profile-info">
                <h3 className="custom-profile-name">David Adams</h3>
                <p className="custom-profile-role">Senior Product Designer</p>
                {/* <p className="custom-trial-expiry">Trial Expires in 02 Days.</p> */}
              </div>
            </div>

            <div className="custom-progress-section">
              <h4>Your Profile Progress</h4>
              <p>Complete your profile to impress recruiters</p>
              <div className="custom-progress-bar">
                <div className="custom-progress-fill" style={{ width: "85%" }}></div>
              </div>
              <span className="custom-progress-percent">85%</span>
            </div>
            <div className="d-flex gap-2">
              <button className="rbt-btn btn-gradient radius-round sm-btn">Edit Profile</button> <button className="rbt-btn btn-gradient radius-round sm-btn">Share Profile</button>
            </div>


          </div>
        </div>

        <div className="col-lg-7 ">
          <div className="rbt-accordion-style rbt-accordion-01 rbt-accordion-06 accordion">
            <div className="accordion" id="tutionaccordionExamplea1">
              {/* Accordion Item 1 */}
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Personal Information
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#tutionaccordionExamplea1"
                >
                  <div className="accordion-body card-body">
                    {/* <h6 className="title">Full-time Undergraduate Program</h6> */}
                    <div className="table-responsive mobile-table-750">
                      <div className="custom-info-card">

                        <div className="custom-info-table">
                          <div className="custom-info-row">
                            <span className="custom-info-label">Register No :</span>
                            <span className="custom-info-value">123456</span>
                          </div>
                          <div className="custom-info-row">
                            <span className="custom-info-label">About me :</span>
                            <span className="custom-info-value">Creative Designer & Developer</span>
                          </div>
                          <div className="custom-info-row">
                            <span className="custom-info-label">Born on :</span>
                            <span className="custom-info-value">2025-08-28</span>
                          </div>
                          <div className="custom-info-row">
                            <span className="custom-info-label">Gender :</span>
                            <span className="custom-info-value">Male</span>
                          </div>
                          <div className="custom-info-row">
                            <span className="custom-info-label">Blood Group :</span>
                            <span className="custom-info-value">A_NEGATIVE</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Accordion Item 2 */}
              <div className="accordion-item card">
                <h2 className="accordion-header card-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Master of Business Administration
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#tutionaccordionExamplea1"
                >
                  <div className="accordion-body card-body">
                    <h6 className="title">Postgraduate Program</h6>
                    <div className="table-responsive mobile-table-750">
                      <table className="rbt-table table table-borderless">
                        <thead>
                          <tr>
                            <th>Program Term</th>
                            <th>Tuition Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>Term 1-4</th>
                            <td>$8,000</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Total</th>
                            <th>$32,000</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}

      </div>
    </div>
  );
};

export default ProfilePage;
