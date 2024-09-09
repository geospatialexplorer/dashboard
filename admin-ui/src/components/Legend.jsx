const LegendComponent = () => {
  const legendItems = [
    // { color: "rgb(47, 110, 189)", label: "Celtic Blue" },
    // { color: "rgb(42, 42, 42)", label: "Jet" },
    // { color: "rgb(145, 181, 255)", label: "Jordy Blue" },
    // { color: "rgb(72, 98, 172)", label: "True Blue" },
    // { color: "rgb(246, 227, 1)", label: "Aureolin" },
    // { color: "rgb(243, 154, 38)", label: "Carrot Orange" },
    { color: "#f7fbff", label: "< 0.2" },
    { color: "rgb(42, 42, 42)", label: "0.2 - 0.4" },
    { color: "#c6dbef", label: "0.4 - 0.6" },
    { color: "rgb(145, 181, 255)", label: "0.6 - 0.8" },
    { color: "rgb(246, 227, 1)", label: "0.8 - 1" },
    { color: "rgb(243, 154, 38)", label: "1 - 2" },
    { color: "rgb(72, 98, 172)", label: "2 - 4" },
    { color: "#a1d99b", label: "4 - 6" },
    { color: "#31a354", label: "6 - 8" },
    { color: "#006d2c", label: "8 - 10" },
    { color: "#d73027", label: "> 10" },
  ];

  return (
    <div
    // style={{
    //   position: "absolute",
    //   bottom: "10px",
    //   left: "10px",
    //   background: "white",
    //   padding: "10px",
    //   borderRadius: "5px",
    //   // boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
    //   // border: "1px solid black",
    //   zIndex: 1000,
    //   opacity: 0.8,
    // }}
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
