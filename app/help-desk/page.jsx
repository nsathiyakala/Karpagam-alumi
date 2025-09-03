import BackToTop from "@/app/backToTop";
import Institution from "../institution/(institution)";
import HelpDeskForm from "./(help-desk)";




export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const HelpDeskFormPage = () => {
  return (
    <>
      <HelpDeskForm />
      <BackToTop />
    </>
  );
};

export default HelpDeskFormPage;
