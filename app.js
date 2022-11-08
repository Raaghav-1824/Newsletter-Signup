const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https=require("https");
const config=require("./config.json");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

var myKey=config.MY_KEY;
var audKey=config.AUD_KEY;

// console.log(config);
// console.log(config.AUD_KEY);
// console.log(config.MY_KEY);

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/signup.html")
});

app.post("/",(req,res)=>{
   const fName=req.body.fname;
   const lName=req.body.lname;
   const userEmail=req.body.email;
   
    // userPassword=req.body.password;
  
    const data={
        members:[{
           email_address:userEmail,
           status:"subscribed",
           merge_fields:{
            FNAME:fName,
            LNAME:lName
           }

           
        }]

    }

    const jsonData=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/"+ audKey;
 

    const options={
        method:"POST",
        auth:"shivam:" + myKey 
       
    }

    const request= https.request(url,options,(response)=>{
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html")

        }
        
        response.on("data",(data)=>{
            console.log(JSON.parse(data))

        });

    })

    request.write(jsonData);
    request.end();

});

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT||3000, (req, res) => {
    console.log("port started at localhost 3000")
})


