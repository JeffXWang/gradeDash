import React,{Component} from 'react';
import * as d3 from 'd3';

// 什么样的data?  [{grade: A, freq: #}, ....]
const BarGraph =(svg,data)=>{
  console.log('from bar',data,d3.extent(data.map(d=>d.freq)));

  let x = d3.scaleBand().range([0,400]).domain(data.map(d=>d.grade))
  let y = d3.scaleLinear().range([200,0]).domain(d3.extent(data.map(d=>d.freq)))




  //第三   select svg  [动]
  let g = d3.select(svg).append('g')
  .attr("transform", "translate(25," + (25) + ")")


  //第四  data append  consume scales
  g.selectAll('rect').data(data).enter()
  .append('rect')
    .attr('x',d=>x(d.grade))
    .attr('width',d=>x.bandwidth())
    .attr('y',d=>y(d.freq))
    .attr('height',d=>200-y(d.freq))
    .attr('fill','green');

  //第五  axis
  g.append('g')       // 《- 3              //第五   axis
  .attr("transform", "translate(0," + (200) + ")")
  .call(d3.axisBottom(x))
  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y));
}

export default BarGraph;
