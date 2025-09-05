
import BackToTop from "@/app/backToTop";
import ProfileAlumni from "./(profile-alumni)";


export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const ProfileAlumniPage = async () => {
  return (
    <>
      <ProfileAlumni/>
      <BackToTop/>
    </>
  );
};

export default ProfileAlumniPage;