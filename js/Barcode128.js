var bloky = [1361,1301,341,2372,1412,1352,2132,1172,1112,2117,1157,1097,1616,1556,596,1376,1316,356,101,1541,581,1121,1061,530,1346,1286,326,1106,1046,86,2321,401,281,2432,2312,392,2192,2072,152,2177,2057,137,2576,656,536,2336,416,296,290,641,521,2081,161,545,2306,386,266,2066,146,26,50,197,11,3392,1472,3332,452,1292,332,3152,1232,3092,212,1052,92,77,3077,35,1037,56,1856,1796,836,1136,1076,116,1091,1031,71,785,305,275,2816,896,776,2096,176,2051,131,800,560,770,515,1217,3137,1601,41];
var znakyB = [" ","!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~"];
var znakyC = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99"];
//var specBloky = [];
//https://en.wikipedia.org/wiki/Code_128
//delka ve čtirkové soustavě
//https://liveweave.com/lH0oVf
console.log(bloky);

var Point = function(x,y){
  this.y = y;
  this.x = x;

};

var Code128 = function(data){
  if((data === null)||(data == "")){data = "http://11petr11.eu/"};
  this.decodeString(data);
};

Code128.prototype = {  //https://www.zdrojak.cz/clanky/tridy-dedicnost-a-oop-v-javascriptu-ii/
  writeToCanvas2: function(Canvas,l,t,w,h){
    var wtc = new writeToCanvas(this, Canvas, l, t, w, h);
  },
  decodeString: function(s){
    this.arrwords = [];
    var slovicka = s.split(/(^\d\d$|^(?:\d\d){2,}|(?:\d\d){2,}$|(?:\d\d){3,})/g);//https://regex101.com/r/d7xqXo/1
    var start = 0;
    console.log("slovicka",slovicka);
    if(slovicka[0] === ""){
      //Start Code
      this.arrwords.push(105); //Start Code C
      this.code128C(slovicka[1]);
      start = 2;
    }else{
      this.arrwords.push(104);
      this.code128B(slovicka[0]);
      start = 1;
    }
    for(var i=start;i<slovicka.length;i++){
      if(i%2){//108C
        this.arrwords.push(99);//B->C
        this.code128C(slovicka[i]);
      }else{//108B
        this.arrwords.push(100);//C->B
        this.code128B(slovicka[i]);
      }
    }
    //this.arrwords.push(104); //Start Code B
    //this.arrwords.push(105); //Start Code C
    //this.code128C(s);
  },
  code128B: function(s){
    var arrB = s.split("");
    arrB.forEach(function(item, i, arr) {
      arr[i] = znakyB.indexOf(item);
    });
    Array.prototype.push.apply(this.arrwords, arrB);//https://stackoverflow.com/questions/4156101/javascript-push-array-values-into-another-array
    console.log(this.arrwords);
  },
  code128C: function(s){
    var arrC = s.match(/.{2}/g);
    arrC.forEach(function(item, i, arr) {
      arr[i] = znakyC.indexOf(item);
    });
    Array.prototype.push.apply(this.arrwords, arrC);//https://stackoverflow.com/questions/4156101/javascript-push-array-values-into-another-array
    console.log(this.arrwords);
  },
  kontrolnySoucet: function(){
    var sum = this.arrwords[0];
    for(var i = 1;i < this.arrwords.length;i++){
      sum += this.arrwords[i]*i;
    }
    return sum % 103;
  }
};

var writeToCanvas = function(parrent,Canvas,l,t,w,h){
    var ctx = Canvas.getContext("2d");
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    ctx.fillStyle = "#000";
    this.kur = new Point(t,l);
    this.krok = 1.6;
    this.h = h;
    this.slovo = 0;
    for(var i = 0; i < parrent.arrwords.length;i++){
      this.slovo = bloky[parrent.arrwords[i]];
      this.vypisBlok(ctx);
    }
    var kontrolMod103 = parrent.kontrolnySoucet();
    console.log("Modulo 103:",kontrolMod103);
    this.slovo = bloky[kontrolMod103];
    this.vypisBlok(ctx);
    this.slovo = 4137;
    this.vypisBlok(ctx,7);
    ctx.stroke();//https://www.w3schools.com/graphics/canvas_drawing.asp
    return null;
};
writeToCanvas.prototype = {
  oneBlok: function(blok,ii){
    return blok >>> ii*2 & 3;
  },
  vypisBlok: function(fn,max){
      if(max === undefined){max = 6;}
      for(var ii = 0; ii < max;ii += 2){
        var delka = this.oneBlok(this.slovo, ii)*this.krok+this.krok;
        fn.fillRect(this.kur.x,this.kur.y,delka,this.h);
        this.kur.x += delka + this.oneBlok(this.slovo, ii+1)*this.krok+this.krok;
      }
   }
};
