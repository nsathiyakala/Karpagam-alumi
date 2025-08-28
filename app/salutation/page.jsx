import BackToTop from "@/app/backToTop";
import Salutation from "./(salutation)";


export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const SalutationPage = () => {
  return (
    <>
      <Salutation />
      <BackToTop />
    </>
  );
};

export default SalutationPage;
