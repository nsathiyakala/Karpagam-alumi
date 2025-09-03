
import BackToTop from "@/app/backToTop";
import MyBasicDetails from "./(edit-profile-contact)";
import MyContacts from "./(edit-profile-contact)";


export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const MyContactPage = async () => {
  return (
    <>
      <MyContacts/>
      <BackToTop/>
    </>
  );
};

export default MyContactPage;
