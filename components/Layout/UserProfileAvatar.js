import React from "react";
import Avatar from "@mui/material/Avatar";

const UserProfileAvatar = ({ name, width, height }) => {
  const avatarName = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const bgcolor = `#${Math.random().toString(16).slice(2, 8).padEnd(6, 0)}`;

  return (
    <Avatar
      sx={{
        bgcolor,
        width,
        height,
      }}
    >
      {avatarName}
    </Avatar>
  );
};

export default UserProfileAvatar;
