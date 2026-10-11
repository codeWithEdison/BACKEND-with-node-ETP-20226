const   express = require('express');  

const  bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const  app = express();
require('dotenv').config();
const db = require('./db')
const requestLogger = require('./logger')

app.use(express.json());
// app.use(requestLogger);



// our  first  endpoint 
/*
syantax :

app.http_METHOD( ROUTE, (req, res){})


*/

app.get( '/', requestLogger, (req, res)=>{
res.status(200).json({message: "welcome  to our  API  "})
// res.send(" welcome to our  server ")
})

app.get('/about', (req, res)=>{
    // databse   sql  only 
    res.status(200). json({name: "edison ", prodession: "software developer"})
})

app.get('/students', (req, res)=>{
let sql = " select * from students";
db.query(sql, (err, result)=>{
    if(err){
        res.status(500).json({message: "fail  to  retrevie  students"})
        console.log(err);
    } 
        res.status(200).json(result)
})
})
//  endpoint  for   get all  teachers 
app.get('/api/teachers', (req,  res)=>{
   let  sql = "select  *  from teachers";
    db.query(sql, (err, result)=>{
        if(err){
            res.status(500).json({ message: " fail to   fetch  teacehrs"})
            console.log(err);
            
        }
        res.status(200).json(result)
    })
})
// endpoint  for  create  teacher
app.post('/api/teachers', (req, res)=>{
    // let names = req.body.names; // let {name} =  request.body
    // let email= req.body.email;
    // let  courses = req.body.courses;
    let {names, email, courses} =  req.body // destruction

    //  {names "  edisn"}

    let  sql  =  ` insert into teachers
    (names, email, courses)   values(? , ?, ?)`;  // prepared  statement 

    db.query(sql, [names, email, courses],(err, result)=>{
        if(err){
            res.status(500).json({message: " fail to  create teacehr"})
            console.log(err);
            
        }
        res.status(201).json({message: " teacehr  created sucess full "})
    })
})

//  get   by id 
//  dyanmic  route
app.get('/api/teachers/:id/', (req, res)=>{
    let  {id}  =  req.params; //  destructng same  as let  id =  req.params.id
    let sql = ` select  *  from teachers where  id = ?`; //  prepred  statement 
    db.query(sql, [id], (err , result)=>{
        if(err){
             res.status(500).json({message: " fail to  get  teacehr"})
            console.log(err); 
        }
        res.status(200).json(result);
    })
})

//? task:  make  endpoint  to  delete  teacehr  by id : 5  min 

app.delete('/api/students/:id/', (req, res)=>{
    let  {id}  =  req.params; //  destructng same  as let  id =  req.params.id
    let sql = ` delete    from teachers where  id = ?`; //  prepred  statement 
    db.query(sql, [id], (err , result)=>{
        if(err){
             res.status(500).json({message: " fail to  get  teacehr"})
            console.log(err); 
        }
        res.status(200).json({message: " delete  sucessfull"});
    })
})


//update

app.put('/api/teachers/:id', (req, res)=>{
    // let names = req.body.names; // let {name} =  request.body
    // let email= req.body.email;
    // let  courses = req.body.courses;
    let {names, email, courses} =  req.body // destruction
    let id  = req.params.id;
    //  {names "  edisn"}

    let  sql  =  ` update   teachers set names = ? , email=?, courses= ?
   where  id = ?`;  // prepared  statement 

    db.query(sql, [names, email, courses, id],(err, result)=>{
        if(err){
            res.status(500).json({message: " fail to  update teacehr"})
            console.log(err);
            
        }
        res.status(201).json({message: " teacehr  updated sucess full "})
    })
})

//autehtcation 
//1. register 
app.post('/api/register',  async (req, res)=>{
    let  {names, email, password, role} = req.body;
    let hashed_password =  await bcrypt.hash(password, 10); // salt  vale 

    let  sql = `insert  into users(names, email, password_hash, role) values (?, ?, ?, ?)`;
    db.query(sql, [names, email, hashed_password, role], (err, result)=>{
        if(err){
            res.status(500).json({message: "  failt  to  register user"})
            console.log(err.message);
            
        }
        res.status(201).json({message: " new  user  created  sucessully"})
    })
})

// login endpoint 


app.post('/api/login', (req, res)=>{
    let  {email, password} =  req.body;
    let user_sql = ` select  * from users  where  email = ?`; 

    db.query(user_sql, [email], (err, result)=>{
        if(err){
            res.status(500).json({message:  "  fail to login"})
            console.log(err); } 
         if(result.length == 0){
            res.status(400).json({message :" inavid  email  or password " })
        }
        let  user = result[0];
        let  match = bcrypt.compare(password, user.password_hash)
        if(!match){
             res.status(400).json({message :" inavid  email  or password " })
        }
//  token
let token = jwt.sign(
    {id: user.id, email: user.email, role:user.role},
    process.env.JWT_SECRETE,
    {expiresIn : '24h'}
)

res.status(200).json({
    message: "login sicesfully",
    token: token,
    user:user
            })
          
})
})














app.listen(process.env.PORT || 3000,  () => {
    console.log("welcome server  is  running on  port  3001  ....");
    
})

//  create  table  teacher  (name , email , course )(id, created_at , updated_at)
// create api to  get all students  
