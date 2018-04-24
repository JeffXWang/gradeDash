import React,{Component} from 'react';
import * as d3 from 'd3';
import BarGraph from './bar'
import PieGraph from './pie'
import StackGraph from './stack'

class EnterId extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
    this.props.searchId(this.input.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class VisContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      data:null,
      search:null
    }
    this.searchId=this.searchId.bind(this)
  }

  dataEnrich(data){
    return (data.map(d=>{
      d.total = (Number(d.Q1) + Number(d.T1) + Number(d.EC) +Number(d.Attendence))
      return d;
    }))
  }

  dataForPie(data){
    if(!data){console.log('no data')}else{
      let max= data.filter(d=>d.Student==="Max Score")[0];
      return [{name:"Attendence",pts:Number(max.Attendence)},{name:"Q1",pts:Number(max.Q1)},{name:"T1",pts:Number(max.T1)}]
    }
  }
  //finished

  dataForStack(data){
    if(!data){console.log('no data for stack')}else{
      let res= [];
      res = data.map(d=>{
        return {
          id:d.ID||"0001",
            Q1: Number(d.Q1),
            T1: Number(d.T1),
            EC: Number(d.EC),
            Attendence: Number(d.Attendence),
            total: Number(d.total)
        }
      })
      res.columns=['Q1','T1','Attendence','EC']
      return res;
    }
  }
  //finsished

  dataForBar(data){

    let count = {A:0,B:0,C:0,D:0};
    for (let i=0;i<data.length;i++)
    {
      let p = data[i].total/55;
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

  componentWillMount(){
    d3.csv('./grade.csv').then(d=>{
      this.setState({data:this.dataEnrich(d)})
    })
  }

  componentDidMount(){
    console.log('didmount',this.state.data)

  }

  componentDidUpdate(){
    if(!this.state.data){return (<div>loading data</div>)}
    PieGraph(this.refs.pieSVG, this.dataForPie(this.state.data));
    BarGraph(this.refs.barSVG,this.dataForBar(this.state.data));
    StackGraph(this.refs.stackSVG,this.dataForStack(this.state.data),String(this.state.search))

  }
  render(){
    console.log("render",this.state.data)
    return(
      <div>
        <EnterId searchId={this.searchId}/>
        <svg height="230" width="550" ref="pieSVG" />
        <svg height="250" width="550" ref="barSVG" />
        <svg height="550" width="550" ref="stackSVG" />
      </div>
    )

    // return(
    //   <div>
    //     from Container
    //     <BarGraph data={this.dataForBar(this.state.data)}/>
    //     <PieGraph data={this.dataForPie(this.state.data)} />
    //   </div>
    // )
  }
}

// get data, hold data in state, send data
// d3.csv('./grade.csv',(d)=>{
//    console.log(d)
//  }
// )

export default VisContainer;
