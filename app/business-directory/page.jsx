import BusinessDirectory from "./(business-directory)";
import BackToTop from "@/app/backToTop";

export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const BusinessDirectoryPage = async () => {
  return (
    <>
      <BusinessDirectory />
      <BackToTop/>
    </>
  );
};

export default BusinessDirectoryPage;
