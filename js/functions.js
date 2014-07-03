//GENERAL UTILITY METHODS
function testFunction(){
  console.log('[function.js] testFunction');
}

function addSpanToFilterResult(filterResult, filter){
  var substr = filterResult.text().toLowerCase().split(filter);
  var fixedstr = '';
  for(var i=0; i<substr.length; i++){
    fixedstr += substr[i];
    if(i != substr.length-1){
      fixedstr += '<span>'+filter+'</span>';
    }
  }
  return fixedstr;
}
