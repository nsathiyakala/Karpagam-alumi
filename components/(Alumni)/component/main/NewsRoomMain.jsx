import React from "react";
import Card from "@/components/Cards/Card";
import EventDetails from "../../../../data/KitEvents.json";
import Image from "next/image";
import Link from "next/link";

const NewsRoomMain = () => {
  let getAllCourse = EventDetails;
  return (
    <div className="rbt-rbt-card-area  bg-color-white ">
      <div className="container">
    

        <div className="row g-5 ">
          {getAllCourse?.map((data, index) => (
            <div className={`col-12`} key={index}>
              <div className="rbt-card variation-04 rbt-hover newsroom-card">
                <div className="rbt-card-img">
                  <Link className="h-100" href={`/course-details/${data.id}`}>
                    <Image
                      src={data.courseImg}
                      width={355}
                      height={244}
                      alt="Card image "
                      className="h-100"
                    />
                    
                  </Link>
                </div>
                <div className="rbt-card-body">
                  <ul className="rbt-meta">
                    <li>
                      <i className="feather-book"></i>
                      {data.lesson}
                    </li>
                    <li>
                      <i className="feather-users"></i>
                      {data.student}
                    </li>
                  </ul>
                  <h4 className="rbt-card-title">
                    <Link href={`/course-details/${data.id}`}>
                      {data.courseTitle}
                    </Link>
                  </h4>
                  <p className="rbt-card-text">{data.desc}</p>

                  <div className="rbt-card-bottom">
                    <Link
                      className="rbt-btn-link color-primary"
                      href={`/course-details/${data.id}`}
                    >
                      Enroll Course
                      <i className="feather-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="row row--15">
                <Card
                  col="col-lg-4 col-md-6 col-sm-6 col-12"
                  mt="mt--30"
                  start={0}
                  end={3}
                  isDesc={true}
                  isUser={true}
                />
              </div> */}
      </div>
    </div>
  );
};

export default NewsRoomMain;
