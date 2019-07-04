import React from "react";

export function CustomList({ children }) {
  return (
    <ul
      className="custom-list"
      style={{
        color: "darkgreen"
      }}
    >
      {children}
    </ul>
  );
}

CustomList.HTML_TAG = "ul";
