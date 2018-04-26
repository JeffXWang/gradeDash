import React,{Component} from 'react';
import * as d3 from 'd3';
const d3Tip =require("d3-tip")



const StackGraph=(svg,data,searchId)=>{
  console.log('stack initial',svg,data,d3.max(data.map(d=>d.total)));
  d3.select(svg).selectAll('g').remove()

  data.sort((a,b)=>a.total-b.total).reverse()
  //第一  scale, band ,radial

  let x= d3.scaleBand().range([0,2*Math.PI]).domain(data.map(d=>d.id));
  // let y= d3.scaleLinear().range([100,200]).domain(d3.extent(data.map(d=>d.total)))
  let y= d3.scaleLinear().range([85,200]).domain( [0,d3.max(data.map(d=>d.total))] )

  let z=d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    .domain(data.columns);



  //第二

  let tip = d3Tip().attr('class', 'd3-tip').html(d=>{
    let text = ""
    for (let key in d.data){
      if(key!="id"){
        text += "<span>" +key +":"+d.data[key] + "</span><br>"
      }
    }

    return text
  });

  let g = d3.select(svg)
  .append("g")
    .attr(
        "transform",
        "translate("+275+"," + 235 + ")");
  g.call(tip);
  let layer=   g.selectAll("g")
    .data(d3.stack().keys(data.columns)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
  layer.selectAll("path")
    .data(d=>d)
    .enter().append("path")
      .attr("d",
        d3.arc()
          .innerRadius(d=>y(d[0])+2)
          .outerRadius(function(d) {console.log(y(d[0]),y(d[1])); return y(d[1]); })
          .startAngle(function(d) { return x(d.data.id)+0.01; })
          .endAngle(function(d) { return x(d.data.id) + x.bandwidth(); })
        )
      .on("mouseover",tip.show)
      .on("mouseout",tip.hide)
  let label = g.append("g")
  .selectAll("g")
  .data(data)
  .enter().append("g")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      d=>("rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 80 + ",0)")
    );

  let label2 = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        d=>("rotate(" + ((x(d.id) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + 220 + ",0)")
      );




  label.append("text")
    .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
    .attr('stroke',' #00ff00')
    .text( d=> {
      if (d.id==searchId){
        return d.id
      } else if (d.id=="MaxScore"){
        return "max"
      }
    } );

  label2.append("text")
    .attr("transform", function(d) { return (x(d.id) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
    .attr('stroke',' #00ff00')
    .text( d=> {
      if (d.id==searchId){
        return d.total
      } else if (d.id=="MaxScore"){
        return d.total
      }
    } );

//
let yAxis=g.append('g').attr("text-anchor", "end");

//the data is points, the text is ABCD
let gradeLine = [.9,.8,.7,.6].map(d=>d*(data.find(d=>d.id=="MaxScore").total))
console.log('gradeLine',gradeLine)
let yTick= yAxis.selectAll('g')
  .data(gradeLine)
  .enter().append('g');
yTick.append('circle')
  .attr('fill','none')
  .attr("stroke", "#000")
  .attr("stroke-opacity", 0.5)
  .attr('r',y);
//get the to return the text,  score to letter
let letterGrade = d3.scaleOrdinal().domain(gradeLine).range(["A","B","C","D"]);
yTick.append('text')
  .attr('x',-6)
  .attr('y',d=>-y(d)+7)
  .text(d=>letterGrade(d))


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
