// components/SEO.js
import { DefaultSeo } from "next-seo";

const SEO = ({ title, description, image }) => {
  return (
    <DefaultSeo
      title={title}
      description={description}
      openGraph={{
        type: "website",
        title,
        description,
        images: [{ url: image }],
      }}
    />
  );
};

export default SEO;
