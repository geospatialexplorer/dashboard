import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
import {
  ArrowRightOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  UserAddOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import AOS from "aos";
import "aos/dist/aos.css";
import OpenLayersMap from "./OpenLayers";

const AnimatedCard = styled(animated(Card))`
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MoreInfoButton = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 5px;
  border-radius: 0 0 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const IconContainer = styled.div`
  font-size: 50px;
  color: rgba(255, 255, 255, 0.3);
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextContent = styled.div`
  color: white;
`;

const cardStyle = {
  color: "white",
  padding: "20px",
};

const Dashboard = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const cardsData = [
    {
      title: "New Orders",
      count: 150,
      color: "#00bfa5",
      icon: <ShoppingOutlined />,
      aosAnimation: "flip-left",
    },
    {
      title: "Bounce Rate",
      count: "53%",
      color: "#4caf50",
      icon: <LineChartOutlined />,
      aosAnimation: "fade-up",
    },
    {
      title: "User Registrations",
      count: 44,
      color: "#ffca28",
      icon: <UserAddOutlined />,
      aosAnimation: "zoom-in",
    },
    {
      title: "Unique Visitors",
      count: 65,
      color: "#f44336",
      icon: <PieChartOutlined />,
      aosAnimation: "flip-right",
    },
  ];

  // Keep the animation simple and trigger it on initial render
  const props = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 1000 },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        {cardsData.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <AnimatedCard
              data-aos={card.aosAnimation}
              style={{ backgroundColor: card.color, ...props }}
              hoverable
              bodyStyle={cardStyle}
            >
              <CardContent>
                <TextContent>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {card.count}
                  </div>
                  <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                    {card.title}
                  </div>
                </TextContent>
                <IconContainer>{card.icon}</IconContainer>
              </CardContent>
              <MoreInfoButton>
                More info <ArrowRightOutlined style={{ marginLeft: "5px" }} />
              </MoreInfoButton>
            </AnimatedCard>
          </Col>
        ))}
      </Row>
      <OpenLayersMap/>
    </div>
  );
};

export default Dashboard;
