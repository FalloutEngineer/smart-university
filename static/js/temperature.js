function temphum(temp, hum){
    document.getElementById('hmdt').innerHTML=hum; 

    if (temp >= 5   && temp <= 18 ){
        document.getElementById("bar").style.stroke = "darkblue"; 
        document.getElementById("ball").style.fill = "darkblue"; 
    }
    if ( temp >= 19  && temp <=24 ){
        document.getElementById("bar").style.stroke = "darkgreen"; 
        document.getElementById("ball").style.fill = "darkgreen"; 
    }
    if ( temp >=25 && temp <=40 ){
        document.getElementById("bar").style.stroke = "darkred"; 
        document.getElementById("ball").style.fill = "darkred"; 
    }
    if (temp < 5 ){
        document.getElementById("bar").style.stroke = "darkblue"; 
        document.getElementById("ball").style.fill = "darkblue"; 
        document.getElementById("bar").setAttribute("y2", "95.5"); 
    }
    if (temp > 40 ){
        document.getElementById("bar").style.stroke = "darkred"; 
        document.getElementById("ball").style.fill = "darkred";
        document.getElementById("bar").setAttribute("y2", "45.9"); 
    } 
    var valuesList = {
        5: '95.5',
        6: '94.3',
        7: '92.5',
        8: '91.5',
        9: '89.8',
        10: '88.6',
        11: '87.2',
        12: '85.6',
        13: '84.1',
        14: '82.7',
        15: '81.2',
        16: '80.0',
        17: '78.7',
        18: '77.2',
        19: '75.9',
        20: '74.3',
        21: '72.9',
        22: '72.5',
        23: '70.1',
        24: '68.5',
        25: '67.3',
        26: '65.7',
        27: '64.7',
        28: '62.9',
        29: '61.7',
        30: '60.2',
        31: '58.7',
        32: '57.5',
        33: '55.8',
        34: '54.7',
        35: '53.1',
        36: '51.9',
        37: '50.1',
        38: '48.9',
        39: '47.5',
        40: '45.9'
    };
    document.getElementById("bar").setAttribute("y2", valuesList[temp]); //Температуру в цифри
}

function cotvoc(co2, tvoc){
    document.getElementById('co2').innerHTML=co2; 
    document.getElementById('tvoc').innerHTML=tvoc; 
}


var interval = setInterval(function(){
    $.ajax({
         cache:false,
         type: 'POST',
         url: "http://195.54.162.59:8080/api/auth/login",
         data:JSON.stringify({"username":"dvlad0847@gmail.com","password": "al140190alo"}),
         contentType: "application/json",
         accept:"application/json",
         success:  function(data) {
                   usrtoken="Bearer "    
                   usrtoken+=data['token'];
                   $.ajax({
         cache:false,
         type: 'GET',
         url: "http://195.54.162.59:8080/api/plugins/telemetry/DEVICE/02d79780-907c-11eb-8985-7521daa0a0a6/values/timeseries?keys=temperature,humidity,co2,tvoc",
         contentType: "application/json",
         headers: {
   'X-Authorization' : usrtoken
},
         success:  function(data) {
                //    console.log(data);
                   var temp1=data['temperature'][0]['value'];//температура в С
                   var humidity=data['humidity'][0]['value'];//влажность в %
                   temphum(parseInt(temp1), parseInt(humidity).toFixed(2));

                   var co2=data['co2'][0]['value']; //угарный газ 
                   var tvoc=data['tvoc'][0]['value']; //качество воздуха
                   cotvoc(co2 +" ppm", tvoc);

                   
               
           }
         });
               
           }
         });
    
}, 1000);