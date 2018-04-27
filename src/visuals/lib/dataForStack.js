const dataForStack=(data,items,useAlt)=>{
  if(!data){console.log('no data for stack')}else{
    console.log('dataForStack', data, items,useAlt)
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

export default dataForStack;
