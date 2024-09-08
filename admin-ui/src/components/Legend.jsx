const LegendComponent = () => {
  const legendItems = [
    { color: "red", label: "Type 1" },
    { color: "green", label: "Type 2" },
    { color: "blue", label: "Other Types" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        background: "white",
        padding: "10px",
        borderRadius: "5px",
        // boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
        // border: "1px solid black",
        zIndex: 1000,
        opacity: 0.8,
      }}
    >
      <h4>Legend</h4>
      {legendItems.map((item, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: item.color,
              marginRight: "10px",
              border: "1px solid black",
            }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
        
    </div>
  );
};

export default LegendComponent;
