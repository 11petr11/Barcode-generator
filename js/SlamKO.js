var arrRegex = [/^\d{4}-(sp.+)/];
var arrRegTyp= ["KO-Sp00"];
var SlamKO = function(s){
  this.old = s;
  this.value = s;
  var arr = [];
  for(var i = 0; i<arrRegex.length;i++){
    arr = s.match(arrRegex[i]);
    console.log(arr);
    if(arr !== null){break;}
  }
  if(arr !== null){
    this.novy = arr[1];
    this.value = this.novy;
    this.typ = arrRegTyp[i];
  }
};
