import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
import { useApp } from "@/stores/AppContext";

// prettier-ignore
const hours = [
  '12a', '1a', '2a', '3a', '4a', '5a', '6a',
  '7a', '8a', '9a', '10a', '11a'
];
// prettier-ignore
const days = [
  '一', '二', '三',
  '四', '五', '六', '七'
];
// prettier-ignore
const data = [[0, 0, 10], [0, 1, 4], [0, 2, 2], [4, 3, 0], [0, 4, 8], [10, 5, 0], [0, 6, 5], [0, 7, 2], [0, 8, 7], [0, 9, 1], [0, 10, 0], [0, 11, 5], [0, 12, 4], [0, 13, 3], [0, 14, 1], [0, 15, 3], [0, 16, 4], [10, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 3], [1, 2, 0], [1, 3, 3], [1, 4,8], [1, 5, 0], [1, 6, 1], [1, 7, 1], [1, 8, 6], [1, 9, 9], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 1], [2, 3, 0], [2, 4, 0], [2, 5, 5], [2, 6, 0], [2, 7, 8], [2, 8, 3], [2, 9, 10], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 6], [3, 3, 6], [3, 4, 3], [3, 5, 1], [3, 6, 1], [3, 7, 10], [3, 8, 1], [3, 9, 4], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 4], [4, 3, 0], [4, 4, 7], [4, 5, 1], [4, 6, 9], [4, 7, 7], [4, 8, 10], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 4], [5, 0, 2], [5, 1, 1], [5, 2, 7], [5, 3, 3], [5, 4, 3], [5, 5, 0], [5, 6, 6], [5, 7, 10], [5, 8, 2], [5, 9, 1], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 4], [6, 2, 8], [6, 3, 4], [6, 4, 7], [6, 5, 10], [6, 6, 2], [6, 7, 4], [6, 8, 1], [6, 9, 2], [6, 10, 1], [6, 11, 8], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 3], [6, 17, 8], [6, 18, 0], ]
  .map(function (item) {
  return [item[1], item[0], item[2] || '-'];
});
const option = {
  backgroundColor: "rgba(0,0,0,0)",
tooltip: {
  position: 'top'
},
grid: {
  // height: '60%',
  width: '90%',
  top: '10%'
},
xAxis: {
  type: 'category',
  data: hours,
  splitArea: {
    show: true
  }
},
yAxis: {
  type: 'category',
  data: days,
  splitArea: {
    show: true
  }
},
visualMap: {
  min: 0,
  max: 10,
  calculable: false,
  orient: 'horizontal',
  left: 'center',
  bottom: '5%',
  inRange: {
    color: ['#dde6fb', '#4169e7']
  }
},
series: [
  {
    name: 'Punch Card',
    type: 'heatmap',
    data: data,
    label: {
      show: true
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
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