import React from "react";

const DirectoryHero = ({ title, bgImg }) => {
  return (
    <section
      className="py-24 md:py-36 bg-cover bg-repeat-round"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="container">
        <h1 className="text-center font-semibold text-colorWhite text-2xl md:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default DirectoryHero;
