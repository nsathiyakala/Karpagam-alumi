import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage({
  CourseData,
  tag,
  title
}) {
  // Example profile data — replace with your actual state/props
  const profile = {
    registerNo: "8765432",
    gender: "Other",
    professional: "-",
    education: "-",
    phone: "9876543210",
    email: "repute.sathiyak...@gmail.com",
    milestones: [],
    program: "Herbal Medicine & Pharmacognosy",
    batch: "Batch 2017–2021",
    completion: 10
  };

   const { id } = useParams;
  console.log("✌️id --->", id);
  const router = useRouter()

  const [SingleData, setSingleData] = useState({});
  const [token, setToken] = useState("");
  const [profilePercentage, setProfilePercentage] = useState(0);
  const [isAdmin, setIsAdmin] = useState(null);
  const [milestone, setMilestone] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (!token) {
      router?.push("/login")
    }
    const Admin = localStorage.getItem("isAdmin");
    setIsAdmin(Admin);
  }, []);

  useEffect(() => {
    if (token) {
      SingleDatas(id);
      GetProfileStatus(id);
      GerMilestone(id)
    }
  }, [id, token]);

  const SingleDatas = (id) => {
    axios
      .get(`${BaseURL}/detail_view/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("✌️response --->", response);
        setSingleData(response.data);
      })
      .catch((error) => {
        console.log("❌error --->", error);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  };

  const GerMilestone = (id) => {
    axios
      .get(`${BaseURL}/milestones/`, {
        params: {
          member: id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("resp:", response.data?.results);
        // setFormData(response.data);
        setMilestone(response.data?.results);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const GetProfileStatus = (id) => {
    axios
      .get(`${BaseURL}/profile_status/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("✌️response --->", response);
        setProfilePercentage(response.data?.completion_percentage);
      })
      .catch((error) => {
        console.log("❌error --->", error);
      });
  };


  const handleLinkedInShare = () => {
    const postUrl = encodeURIComponent("http://alumni.decodeschool.com/"); // URL to share
    const postTitle = encodeURIComponent("Milestone"); // Optional title
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}&title=${postTitle}`;
console.log("linkedInUrl", linkedInUrl)
    window.open(linkedInUrl, "_blank", "width=600,height=500");
  };

  const item = SingleData



  return (
    <div className="rbt-accordion-area accordion-style-1 bg-color-white rbt-section-gap kit-profile">
       <div className="container" key={index}>
                 <div className="row mb--50">
                   <div className="col-lg-12">
                     <div className="section-title text-center">
                       {tag ? (
                         <span className="subtitle bg-pink-opacity">{tag}</span>
                       ) : (
                         ""
                       )}
                       <h2 className="title">{title}</h2>
                     </div>
                   </div>
                 </div>
                 <div className="row g-5 align-items-start">
                   <div className="col-lg-7 order-2 order-lg-1">
                     <div className="rbt-accordion-style rbt-accordion-01 rbt-accordion-06 accordion">
                       <div className="accordion" id="tutionaccordionExamplea1">
                         {/* {data.courseBody.map((item, innerIndex) => ( */}
                           <div className="accordion-item card" key={index}>
                             <h2
                               className="accordion-header card-header"
                               id={item.id}
                             >
                               <button
                                 className={`accordion-button ${
                                   !item.collapsed ? "collapsed" : ""
                                 }`}
                                 type="button"
                                 data-bs-toggle="collapse"
                                 data-bs-target={`#${item.collapse}`}
                                 aria-expanded={item.expanded}
                                 aria-controls={item.collapse}
                               >
                                 {item.subTitle}
                               </button>
                             </h2>
                             <div
                               id={item.collapse}
                               className={`accordion-collapse collapse ${
                                 item.show ? "show" : ""
                               }`}
                               aria-labelledby={item.heading}
                               data-bs-parent="#tutionaccordionExamplea1"
                             >
                               <div className="accordion-body card-body">
                                 <h6 className="title">{item.text}</h6>
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
                                         <th>Term 1-6</th>
                                         <td>${item.cost}</td>
                                       </tr>
                                     </tbody>
                                     <tfoot>
                                       <tr>
                                         <th>Total</th>
                                         <th>${item.cost}</th>
                                       </tr>
                                     </tfoot>
                                   </table>
                                 </div>
                               </div>
                             </div>
                           </div>
                         {/* ))} */}
                       </div>
                     </div>
                   </div>
                   <div className="col-lg-5 order-1 order-lg-2">
                     <div className="thumbnail">
                       <Image
                         className="radius-6"
                         src={data.img}
                         width={526}
                         height={644}
                         alt="histudy image"
                       />
                     </div>
                   </div>
                 </div>
               </div>
    </div>
  );
}
