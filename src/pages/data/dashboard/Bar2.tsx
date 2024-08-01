import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
import { useApp } from "@/stores/AppContext";

const  option = {
  backgroundColor: "rgba(0,0,0,0)",
  color:[
    "#4169e7",
    "#6be6c1",
    "#626c91",
    "#a0a7e6",
    "#c4ebad",
    "#96dee8"
  ],
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: '2012',
      type: 'bar',
      data: [19325, 23438, 31000, 121594, 134141, 681807]
    }
  ]
};


const App = ()=> {
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
  
  return(
    <div ref={ref} style={{width: '100%', height: '280px' }}></div>
  )
}

export default App;