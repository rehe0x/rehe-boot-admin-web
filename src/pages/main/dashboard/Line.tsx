import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
import { useApp } from "@/stores/AppContext";

const option = {
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: ''
  },
  color:[
    "#4169e7",
    "#6be6c1",
    "#626c91",
    "#a0a7e6",
    "#c4ebad",
    "#96dee8"
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  toolbox: {
    feature: {
      // saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    }
  ],
  yAxis: [
    {
      type: 'value',
    }
  ],
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410],
      smooth: true
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320],
      smooth: true
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      // label: {
      //   show: true,
      //   position: 'top'
      // },
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      smooth: true
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
    <div ref={ref} style={{width: '75%', height: '350px' }}></div>
  )
}

export default App;