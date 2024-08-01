import React from "react";
import { Space } from "antd";
import Card from "./Card";
import Line from "./Line";
import Bar from "./Bar";
import Bar2 from "./Bar2";
import Pie from "./Pie";
import Heatmap from "./Heatmap";

const App: React.FC = () => (
  <div
    style={{
      padding: "24px",
      width: "100%",
    }}
  >
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Card />

      <div
        style={{
          display: "flex",
          padding: "14px",
          background: "var(--ant-color-bg-container)",
          borderRadius: "var(--ant-border-radius-lg)",
        }}
      >
        <Line />
        <Bar />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            width: "32.5%",
            padding: "14px",
            background: "var(--ant-color-bg-container)",
            borderRadius: "var(--ant-border-radius-lg)",
          }}
        >
          <Bar2 />
        </div>
        <div
          style={{
            width: "32.5%",
            padding: "14px",
            background: "var(--ant-color-bg-container)",
            borderRadius: "var(--ant-border-radius-lg)",
          }}
        >
          <Pie />
        </div>
        <div
          style={{
            width: "32.5%",
            padding: "14px",
            background: "var(--ant-color-bg-container)",
            borderRadius: "var(--ant-border-radius-lg)",
          }}
        >
          <Heatmap />
        </div>
      </div>
    </Space>
    <div></div>
  </div>
);

export default App;
