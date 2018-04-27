import React,{Component} from 'react';
import * as d3 from 'd3';
import BarGraph from './bar'
import PieGraph from './pie'
import StackGraph from './stack'
import dataForStack from './lib/dataForStack'
import dataForPie from './lib/dataForPie'

// when change dataset.  change items and maxScore. expect ID
const maxScore =55;


class EnterId extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.searchId(this.input.value)
  }



  render() {
    // !!!!! here the select interaction with
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            4digit Id:
            <input type="text" ref={(input) => this.input = input} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <button onClick={this.props.toggleData}>include future assignments </button>
        <button onClick={this.props.toggleClass}>toggled class </button>
      </ div>
    );
  }
}

class VisContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      data:null,
      items:{default:["Q1","Attendence","T1","EC"],alt:["Hands-On","Finals","Q1","Attendence","T1","EC"]},
      data2:null,
      items2:{default:["Attendence","P1","P2","P3" ,'EC'],alt:["Attendence","P1","P2","P3" ,'EC']},
      search:null,
      toggleData:false,
      toggleClass:false
    }
    this.searchId=this.searchId.bind(this);
    this.toggleData=this.toggleData.bind(this);
    this.toggleClass=this.toggleClass.bind(this);
    this.getData=this.getData.bind(this);
    this.findData=this.findData.bind(this);
  }

  toggleClass(){
    console.log('about to toggle class', this.state)

    this.setState({toggleClass:!this.state.toggleClass})
  }

  toggleData (){
      console.log('about to toggle data selection', this.state)
      this.setState({toggleData:!this.state.toggleData})
  }

  dataTotal(data,items){
    console.log('total items',items.default)
    return data.map(aStu=>{
      items.default.map(d=> console.log('item default',aStu[d]))
      aStu.total = items.default.reduce((accu,current)=>accu+Number(aStu[current]),0)
      aStu.altTotal = items.alt.reduce((accu,current)=>accu+Number(aStu[current]),0)
      console.log('total',aStu)
      return aStu
    })
  }


  //finished


  //finsished

  dataForBar(data){
    let maxScore= data.find(d=>d.ID=="MaxScore").total
    let count = {A:0,B:0,C:0,D:0};
    for (let i=0;i<data.length;i++)
    {
      let p = data[i].total/maxScore;
      if(p>=0.9){
        count.A+=1
      } else if(p>=0.8) {
        count.B+=1;
      }else if(p>=0.7) {
        count.C+=1;
      }else if(p>=0.6) {
        count.D+=1;
      }else {
        count.F+=1;
      }
    }
    let res=[];
    for(let grade in count){
      res.push({grade:grade,freq:count[grade]})
    }
    console.log(count,res)
    return res;
  }
  //finished

  searchId(id){
    this.setState({search:id})
  }

  getData(items,file,items2,file2){

    d3.csv(file).then(d=>{
      d3.csv(file2).then(dd=>{
        this.setState({
          data:this.dataTotal(d,items),
          data2:this.dataTotal(dd,items2)
        })
      })

    })

  }

  findData(){
    let selection;
    let set;
    if (!this.state.toggleClass){
      set= this.state.data;
      selection = this.state.toggleData? this.state.items.alt:this.state.items.default;
    } else {
      set= this.state.data2;
      selection = this.state.toggleData? this.state.items2.alt:this.state.items2.default;
    }
    let altTotal=this.state.toggleData? true:false;

    return {selection,set,altTotal}
  }


  componentWillMount(){
    this.getData(this.state.items,'./grade.csv',this.state.items2,'./otherSet.csv');

  }

  componentDidMount(){
  }

  componentWillUpdate(){
    let rightData = this.findData();
    console.log('right data?',rightData)
  }

  componentDidUpdate(){
    let rightData = this.findData();

    PieGraph(this.refs.pieSVG,
      dataForPie(rightData.set,rightData.selection));
    BarGraph(this.refs.barSVG,
      this.dataForBar(rightData.set));
    StackGraph(this.refs.stackSVG,
      dataForStack(rightData.set,rightData.selection,rightData.altTotal),
      String(this.state.search))
  }

  render(){


    console.log("render",this.state)
    return(
      <div>
        <svg height="230" width="550" ref="pieSVG" />
        <svg height="250" width="550" ref="barSVG" />
        <EnterId searchId={this.searchId} toggleData={this.toggleData} toggleClass={this.toggleClass} />
        <svg height="550" width="550" ref="stackSVG" />
      </div>
    )
}}


export default VisContainer;
