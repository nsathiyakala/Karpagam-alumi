import BackToTop from "@/app/backToTop";

import Batch from "./(batch)";


export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const BatchPage = () => {
  return (
    <>
      <Batch />
      <BackToTop />
    </>
  );
};

export default BatchPage;
