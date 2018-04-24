import React,{Component} from 'react';
import * as d3 from 'd3';



const PieGraph =(svg,data)=>{
  if (!data||!svg){
    console.log("not here",data,svg)

    return;
  }
  console.log("here now",data)
  let g = d3.select(svg)
      .append('g')
        .attr('class','pieSVG')
        .attr(
          "transform",
          "translate("+275+"," + 115 + ")");
  let label = d3.arc()
      .outerRadius(100)
      .innerRadius(50);
  let pie=d3.pie().sort(null).value(d=>d.pts)
  let path = d3.arc()
      .innerRadius(50)
      .outerRadius(100)
      .padAngle(0.01);
  let arc = g.selectAll('g').data(pie(data))
  .enter()
  .append('g').attr('class','arcs');

  arc.append('path')
      .attr('d',path)
      .attr('fill','green');
  arc.append("text")
   .attr("transform", function(d) {
            return "translate(" + label.centroid(d) + ")";
    })
   .text(d=>d.data.name);



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
