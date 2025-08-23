import About from "./(about)";

import { getAllPostsMeta } from "@/mdx";

export const metadata = {
  title: "Histudy - Online Courses & Education NEXTJS14 Template",
  description: "Online Courses & Education NEXTJS14 Template",
};

const AboutPage = async () => {
  const blog = await getAllPostsMeta();
  return (
    <>
      <About getBlog={blog} />
    </>
  );
};

export default AboutPage;