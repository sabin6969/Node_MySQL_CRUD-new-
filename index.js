import express from "express";
import mysql from "mysql2";

const app = express();
// middleware
app.use(express.json());

let mysqlConnection;

// default route
app.get("/",(req,res)=>{
    res.status(200).send("Sucess");
});


app.post("/add",(req,res)=>{
    let {userName,userAge}=req.body;
    if(userName && userAge){
      userAge = parseInt(userAge);
      if(!isNaN(userAge)){
        const sqlQuery = `INSERT INTO userinfo (userName,userAge) VALUES ('${userName}', ${userAge})`
        mysqlConnection.query(sqlQuery,(err)=>{
            if(err){
                res.status(400).json({
                    sucess:false,
                    message:err,
                })
            }else{
                res.status(200).json({
                    sucess:true,
                    message:"User details added sucessfully"
                });
            }
        });
      }else{
        res.status(400).json({
            sucess:false,
            message:"Enter valid age",
        })
      }
    }else{
        res.status(400).json({
            sucess:false,
            message:"All fileds are required",
        });
    }
});


app.get("/getAll",(req,res)=>{
    const sqlQuery = `SELECT * FROM userinfo`;
    mysqlConnection.query(sqlQuery,(err,row,field)=>{
        if(err){
            res.status(500).json({
                sucess:false,
                message:err,
            });
        }else{
            console.log(row);
            res.status(200).json(row);
        }
    });
});

app.listen(3000,()=>{
    mysqlConnection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"poudeL46@",
        database:"userdetails"
    });
    console.log("Server has Started");
})