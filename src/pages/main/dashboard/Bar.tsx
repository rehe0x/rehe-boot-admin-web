import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { useApp } from "@/stores/AppContext";

const option = {
  backgroundColor: "rgba(0,0,0,0)",
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // Use axis to trigger tooltip
      type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  color: ["#4169e7", "#6be6c1", "#626c91", "#a0a7e6", "#c4ebad", "#96dee8"],
  legend: {},
  grid: {
    left: "0%",
    right: "4%",
    top: "20%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    show: true,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri",'Fsd','Vld'],
  },
  yAxis: {
    type: "value",
    show: false,
  },
  series: [
    {
      name: "Direct",
      type: "bar",
      stack: "total",
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: "series",
      },
      data: [320, 302, 301, 334, 390,222,333],
    },
    {
      name: "Mail Ad",
      type: "bar",
      stack: "total",
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90,133,222],
    },
    {
      name: "Affiliate Ad",
      type: "bar",
      stack: "total",
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290,133,111],
    },
  ],
};

const App = () => {
  const { theme } = useApp();
  const ref = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const initChart = () => {
    if (ref.current) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      chartInstance.current = echarts.init(ref.current, theme);
      chartInstance.current.setOption(option);
    }
  };
  useEffect(() => {
    initChart();
    // 清理函数以销毁 ECharts 实例
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [theme]);

  return <div ref={ref} style={{ width: "25%", height: "350px" }}></div>;
};

export default App;
