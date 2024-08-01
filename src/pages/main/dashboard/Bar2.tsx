import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
const  option = {
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
  const ref = useRef(null)
  const initChart = ()=> {
    const myChart = echarts.init(ref.current, '');
    myChart.setOption(option);
  }
  
  useEffect(()=>{
    initChart()
  },[])
  
  return(
    <div ref={ref} style={{width: '100%', height: '280px' }}></div>
  )
}

export default App;