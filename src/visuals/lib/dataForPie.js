const dataForPie=(data,items)=>{
  if(!data){console.log('no data')}else{
    console.log('dataForPie', data, items)

    let max= data.find(d=>(d.ID=="MaxScore"));
    let res =items.map(item=>({label:item,size:max[item]}))
    console.log('res',res)
    return res;
  }
}

export default dataForPie;
