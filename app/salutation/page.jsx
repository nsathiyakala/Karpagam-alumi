import BackToTop from "@/app/backToTop";
import NewsRoom from "./(salutation)";

export const metadata = {
  title: "Course With Sidebar - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const NewsRoomPage = () => {
  return (
    <>
      <NewsRoom />

      <BackToTop />
    </>
  );
};

export default NewsRoomPage;
