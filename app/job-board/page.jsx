import JobBoard from "./(job-board)";
import BackToTop from "@/app/backToTop";

export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const JobBoardPage = async () => {
  return (
    <>
      <JobBoard />
      <BackToTop/>
    </>
  );
};

export default JobBoardPage;
