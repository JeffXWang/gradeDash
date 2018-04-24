import React,{Component} from 'react';
import * as d3 from 'd3';



const StackGraph=(svg,data,searchId)=>{
  console.log('stack initial',svg,data);

  //第一  scale, band ,radial
  data.sort((a,b)=>a.total-b.total).reverse()
  console.log('stack sorted',data);

  let x= d3.scaleBand().range([0,2*Math.PI]).domain(data.map(d=>d.id));
  let y= d3.scaleLinear().range([100,200]).domain(d3.extent(data.map(d=>d.total)))
  let z=d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    .domain(data.columns);

  //第二
  let g = d3.select(svg)
  .append("g")
    .attr(
        "transform",
        "translate("+275+"," + 215 + ")");

  let layer=   g.selectAll("g")
    .data(d3.stack().keys(data.columns)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); });
  layer.selectAll("path")
    .data(function(d) { return d; })
    .enter().append("path")
      .attr("d",
        d3.arc()
          .innerRadius(d=>y(d[0])+2)
          .outerRadius(function(d) { return y(d[1]); })
          .startAngle(function(d) { return x(d.data.id)+0.01; })
          .endAngle(function(d) { return x(d.data.id) + x.bandwidth(); })
        )
  let label = g.append("g")
  .selectAll("g")
  .data(data)
  .enter().append("g")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      d=>("rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 70 + ",0)")
    );

  let label2 = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        d=>("rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 230 + ",0)")
      );


  // label.append("line")
  //   .attr("x2", -5)
  //   .attr("stroke", "#000");
  //
  label.append("text")
    .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
    .text( d=> {return d.id==searchId? d.id:null} );
  label2.append("text")
    .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
    .text( d=> {return d.id==searchId? d.total:null} );
  //
  var yAxis = g.append("g")
    .attr("text-anchor", "end");

  var yTick = yAxis
  .selectAll("g")
  .data(y.ticks(5))
  .enter().append("g");
  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.5)
      .attr("r", y);

  yTick.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .text(y.tickFormat(10, "s"));

  yTick.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .text(y.tickFormat(10, "s"));

  // yAxis.append("text")
  //     .attr("x", -6)
  //     .attr("y", function(d) { return -y(y.ticks(10).pop()); })
  //     .attr("dy", "-1em")
  //     .text("Population");

      var legend = g.append("g")
        .selectAll("g")
        .data(data.columns.reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

      legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", z);

      legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", "0.35em")
          .text(function(d) { return d; });
}

export default StackGraph;
//data
