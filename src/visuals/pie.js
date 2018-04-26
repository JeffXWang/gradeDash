import React,{Component} from 'react';
import * as d3 from 'd3';
const d3Tip = require("d3-tip")  // use this not import

// data    pts = arc size, name = arc label,

const PieGraph =(svg,data)=>{
  if (!data||!svg){
    console.log("pie not here",data,svg)

    return;
  }
  console.log("pie here now",data)
  d3.select(svg).selectAll('g').remove()

  let tip = d3Tip().attr('class', 'd3-tip').html(d=>{
    console.log('data for tip',d)
    return ("<span>" +d.data.label+":"+d.data.size + "</span>")
  });
  let g = d3.select(svg)
      .append('g')
        .attr('class','pieSVG')
        .attr(
          "transform",
          "translate("+275+"," + 115 + ")");
  g.call(tip)
  let label = d3.arc()
      .outerRadius(100)
      .innerRadius(50);
  let pie=d3.pie().sort(null).value(d=>d.size)
  let path = d3.arc()
      .innerRadius(50)
      .outerRadius(100)
      .padAngle(0.01);
  let arc = g.selectAll('g').data(pie(data))
  .enter()
  .append('g').attr('class','arcs');

  arc.append('path')
      .attr('d',path)
      .attr('fill','green')
      .on("mouseover",tip.show)
      .on("mouseout",tip.hide);
  arc.append("text")
   .attr("transform", function(d) {
            return "translate(" + label.centroid(d) + ")";
    })
   .text(d=>(d.data.size>5? d.data.label:""));



  // let label = g.append("g")
  //   .selectAll("g")
  //   .data(data)
  //   .enter().append("g")
  //     .attr("text-anchor", "middle")
  //     .attr(
  //       "transform",
  //       d=>("rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 150 + ",0)")
  //     );
  // label.append("text")
  //   .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
  //   .text( d=> );
}

export default PieGraph;
