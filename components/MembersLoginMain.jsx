import React from "react";

import MembersLoginCard from "./MembersLoginCard";
import SideBarLogin from "./KITSidebar/SideBarLogin";

const MembersLoginMain = () => {
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
                      <SideBarLogin/>
                    </div>

                    <div className="col-lg-9">
                      <MembersLoginCard />
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
