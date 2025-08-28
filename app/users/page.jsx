import BackToTop from "@/app/backToTop";
import Users from "./(users)";


export const metadata = {
  title: "Instructor Dashboard - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const UsersPage = () => {
  return (
    <>
      <Users />
      <BackToTop />
    </>
  );
};

export default UsersPage;
