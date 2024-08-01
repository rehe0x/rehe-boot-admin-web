import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // Use axis to trigger tooltip
      type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
    }
  },
  color:[
    "#4169e7",
    "#6be6c1",
    "#626c91",
    "#a0a7e6",
    "#c4ebad",
    "#96dee8"
  ],
  legend: {},
  grid: {
    left: '0%',
    right: '4%',
    top: '20%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
   

    type: 'category',
    show: true,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', ]
    
  },
  yAxis: {
    type: 'value',
    show: false
  },
  series: [
    {
      name: 'Direct',
      type: 'bar',
      stack: 'total',
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: 'series'
      },
      data: [320, 302, 301, 334, 390, ]
    },
    {
      name: 'Mail Ad',
      type: 'bar',
      stack: 'total',
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, ]
    },
    {
      name: 'Affiliate Ad',
      type: 'bar',
      stack: 'total',
      // label: {
      //   show: true
      // },
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, ]
    },
   
    
  ]
};



const App = ()=> {
  const ref = useRef(null)
  const initChart = ()=> {
    const myChart = echarts.init(ref.current, '');
    myChart.setOption(option);
  }
  
  useEffect(()=>{
    initChart()
  },[])
  
  return(
    <div ref={ref} style={{width: '25%', height: '350px' }}></div>
  )
}

export default App;