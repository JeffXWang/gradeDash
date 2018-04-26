import React,{Component} from 'react';
import * as d3 from 'd3';
import BarGraph from './bar'
import PieGraph from './pie'
import StackGraph from './stack'

// when change dataset.  change items and maxScore. expect ID
const items ={default:["Q1","Attendence","T1","EC"],alt:["Hands-On","Finals","Q1","Attendence","T1","EC"]};
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
        <button >toggled class </button>
      </ div>
    );
  }
}

class VisContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      data:null,
      search:null,
      toggleData:false
    }
    this.searchId=this.searchId.bind(this);
    this.toggleData=this.toggleData.bind(this)
  }

  toggleData (){
      console.log('about to toggle', this.state)
      this.setState({toggleData:!this.state.toggleData})
  }

  dataTotal(data,items){
    return data.map(aStu=>{
      aStu.total = items.default.reduce((accu,current)=>accu+Number(aStu[current]),0)
      aStu.altTotal = items.alt.reduce((accu,current)=>accu+Number(aStu[current]),0)
      return aStu
    })
  }

  dataForPie(data,items){
    if(!data){console.log('no data')}else{
      let max= data.find(d=>(d.ID=="MaxScore"));
      let res =items.map(item=>({label:item,size:max[item]}))
      console.log('res',res)
      return res;
    }
  }
  //finished

  dataForStack(data,items,useAlt){
    if(!data){console.log('no data for stack')}else{
      console.log('dataForStack', items,useAlt)
      let res= [];
      res = data.map(d=>{

        let aStudent = {
          id:d.ID,
          total:Number(useAlt? d.altTotal:d.total)
        }
        items.map(key=>aStudent[key]=Number(d[key]))

        return aStudent;
      })
      res.columns=items

      return res;
    }
  }
  //finsished

  dataForBar(data){

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

  getData(items){
    d3.csv('./grade.csv').then(d=>{
      this.setState({data:this.dataTotal(d,items)})
    })
  }


  componentWillMount(){
    this.getData(items);
  }

  componentDidMount(){
    console.log('didmount',this.state.data);
  }

  componentWillUpdate(){

  }

  componentDidUpdate(){
    let itemSelection = this.state.toggleData? items.alt:items.default;
    console.log(this.state.toggleData,itemSelection)
    if(!this.state.data){return (<div>loading data</div>)}
    PieGraph(this.refs.pieSVG,
      this.dataForPie(this.state.data,itemSelection));
    BarGraph(this.refs.barSVG,
      this.dataForBar(this.state.data));
    StackGraph(this.refs.stackSVG,
      this.dataForStack(this.state.data,itemSelection,this.state.toggleData),
      String(this.state.search))
  }

  render(){
    console.log("render",this.state.data)
    return(
      <div>
        <svg height="230" width="550" ref="pieSVG" />
        <svg height="250" width="550" ref="barSVG" />
        <EnterId searchId={this.searchId} toggleData={this.toggleData} />
        <svg height="550" width="550" ref="stackSVG" />
      </div>
    )
}}


export default VisContainer;

//plans
// toggle for different data.
// total calc for toggle
