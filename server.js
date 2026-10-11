const   express = require('express');  

const  app = express();

// our  first  endpoint 
/*
syantax :

app.http_METHOD( ROUTE, (req, res){})


*/

app.get( '/',  (req, res)=>{
res.status(200).json({message: "welcome  to our  API  "})
// res.send(" welcome to our  server ")
})

app.get('/about', (req, res)=>{
    // databse   sql  only 
    res.status(200). json({name: "edison ", prodession: "software developer"})
})


app.listen(3001,  () => { //  function fct_nam
    console.log("welcome server  is  running on  port  3001  ....");
    
})

