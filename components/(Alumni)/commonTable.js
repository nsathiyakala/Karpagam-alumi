"use client";

import Link from "next/link";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Modal, Tooltip, Spin } from "antd";
import Pagination from "@/commonComponents/Pagination";

const CommonTable = (props) => {
  const {
    tableHead,
    tableData,
    heading,
    updateStatus,
    loading,
    total,
    currentPage,
    handlePageChange,
  } = props;

  return (
    <>
      <div className="rbt-dashboard-content bg-color-white rbt-shadow-box">
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">
              <div>{heading}</div>
              <span className="btn-icon">
                <i className="feather-users text-bold" size={"80px"}></i>
              </span>
            </h4>
          </div>
          <div className="rbt-dashboard-table table-responsive mobile-table-750 mt--30">
            <table className="rbt-table table table-borderless">
              <thead>
                <tr>
                  {tableHead?.map((item) => (
                    <th>{item}</th>
                  ))}
                  {/* <th>Qus</th>
                  <th>TM</th>
                  <th>CA</th>
                  <th>Result</th> */}
                  <th></th>
                </tr>
              </thead>
              {loading ? (
                <div className="text-center pt-10 ">
                  <Spin size="large" />
                </div>
              ) : (
                <tbody>
                  {tableData?.map((item) => (
                    <tr key={item.member_id}>
                      <td>
                        <img
                          src={
                            item.profile_picture ||
                            "/assets/images/profile/dummy-profile.png"
                          }
                          alt="Profile"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                        <p
                          style={{
                            paddingTop: "10px",
                            fontSize: "14px",
                          }}
                        >
                          {" "}
                          Reg No: {item.register_no}{" "}
                        </p>
                      </td>
                      <td>
                        <Link
                          href={`tel:${item.mobile_no}`}
                          style={{
                            color: "#212529",
                            textDecoration: "underline",
                          }}
                        >
                          {item.mobile_no}
                        </Link>
                      </td>
                      <td>
                        <Link
                          href={`mailto:${item.email}`}
                          style={{
                            color: "#212529",
                            textDecoration: "underline",
                          }}
                        >
                          {item.email}
                        </Link>
                      </td>
                      <td>{item.course}</td>
                      <td>{item.batch}</td>
                      <td>
                        {item.file ? (
                          <Link
                            href={item.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#212529",
                              textDecoration: "underline",
                            }}
                          >
                            {item.file.substring(
                              item.file.lastIndexOf("/") + 1
                            )}
                          </Link>
                        ) : (
                          <span>No file available</span>
                        )}
                      </td>
                      <td>
                        <Tooltip title="Approve">
                          <CheckCircleOutlined
                            className="me-3"
                            onClick={() => updateStatus(item)}
                            style={{ fontSize: "22px" }}
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        {tableData?.length > 0 && (
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
                totalPage={total}
                currentPages={currentPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommonTable;
