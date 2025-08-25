import React, { useEffect, useRef } from "react";

import * as echarts from 'echarts'

const Demo:React.FC = () => {
    // 必须是div节点
    // ts
    const chartRef = useRef<HTMLDivElement>(null) // 必须有值，否则为undefind

    useEffect(()=>{
        if(chartRef.current){
            // 初始化echarts 实例
            const myChart = echarts.init(chartRef.current)
            const options = {
                title:{
                    text:'take my hand'
                },
                tooltip:{},
                legend:{ // 
                    data:['销量']
                },
                series: [
                    {
                        name:'销量',
                        type:'pie',
                        data:[
                            {value:335,name:'直接访问'},
                            {value:30,name:'邮件营销'},
                            {value:210,name:'联盟广告'},
                            {value:610,name:'视频广告'},
                            {value:410,name:'搜索引擎'},
                        ]
                    }
                ]
            }

            
            myChart.setOption(options)
        }
    },[])

    return(
        <div ref={chartRef} style={{width:'600px',height:'400px'}}>

        </div>
    )
}

export default Demo