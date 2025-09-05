
import BackToTop from "@/app/backToTop";
import ProfileExperience from "./(profile-experience)";


export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const ProfileExperiencePage = async () => {
  return (
    <>
      <ProfileExperience/>
      <BackToTop/>
    </>
  );
};

export default ProfileExperiencePage;