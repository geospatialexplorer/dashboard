import React, { useState } from "react";
import "../App.css";

const CheckboxComponent = ({ theme, toggleTheme }) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
    toggleTheme(); // This will trigger the theme change in the parent component
  };

  return (
    <div className="wrap-check-61" style={{ position: "relative" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle} // The onChange event should be attached to the input
       
      />
      <div></div>
    </div>
  );
};

export default CheckboxComponent;
