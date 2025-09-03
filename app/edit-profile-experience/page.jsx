
import BackToTop from "@/app/backToTop";

import MyProfileExperience from "./(edit-profile-experience)";


export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const MyProfileExperiencePage = async () => {
  return (
    <>
      <MyProfileExperience/>
      <BackToTop/>
    </>
  );
};

export default MyProfileExperiencePage;
