
import BackToTop from "@/app/backToTop";
import MyMiltestone from "./(edit-profile-skills)";

// import MyProfileSkills from "./(edit-profile-skills)";


export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const MyMiltestonePage = async () => {
  return (
    <>
      <MyMiltestone/>
      <BackToTop/>
    </>
  );
};

export default MyMiltestonePage;
