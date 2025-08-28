import BackToTop from "@/app/backToTop";
import Salutation from "./(course)";
import Course from "./(course)";


export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const CoursePage = () => {
  return (
    <>
      <Course />
      <BackToTop />
    </>
  );
};

export default CoursePage;
