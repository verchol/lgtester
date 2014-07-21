var request = require('request');
var url = "http://localhost:1337/add"
var trCounter = 0;
var handle = setInterval(function(){
	request.post(url, function(err, data)
		{
			trCounter++
            if (err)
            	console.log("error occured " + err);
            else 
              console.log("transaction succesfull #" + trCounter);

          if (trCounter > 10)
          	clearInterval(handle);
		})
}, 200);