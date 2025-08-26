import BackToTop from "@/app/backToTop";
import EditJob from "./(edit-a-job)";

export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const JobBoardPage = async () => {
  return (
    <>
      <EditJob />
      <BackToTop/>
    </>
  );
};

export default JobBoardPage;
