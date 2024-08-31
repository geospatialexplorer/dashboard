import React, { useState } from "react";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import "../App.css";

const CheckboxComponent = ({ theme, toggleTheme }) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
    toggleTheme(); // This will trigger the theme change in the parent component
  };

  return (
    <div
      className="wrap-check-61"
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          style={{ display: "none" }} // Hide default checkbox
        />
        <div
          style={{
            width: "24px",
            height: "24px",
          
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "28px",
            backgroundColor: checked ? "#333" : "#fff",
            color: checked ? "#fff" : "orange",
            fontSize: "26px",
          }}
        >
          {checked ? <MoonOutlined /> : <SunOutlined />}
        </div>
      
      </label>
    </div>
  );
};

export default CheckboxComponent;
