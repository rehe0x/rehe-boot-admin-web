import React,{useRef, useEffect} from 'react';
import * as echarts from 'echarts';
const option = {
  color:[
    "#4169e7",
    "#6be6c1",
    "#626c91",
    "#a0a7e6",
    "#c4ebad",
    "#96dee8"
  ],
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '0%',
    left: 'center'
  },
 
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
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
    <div ref={ref} style={{width: '100%%', height: '280px' }}></div>
  )
}

export default App;