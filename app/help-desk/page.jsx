import BackToTop from "@/app/backToTop";

import Institution from "./(industry)";


export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const InstitutionPage = () => {
  return (
    <>
      <Institution />
      <BackToTop />
    </>
  );
};

export default InstitutionPage;
