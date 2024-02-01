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


app.get("/get/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    if(!isNaN(id)){
        const sqlQuery = `SELECT * FROM userinfo where userid=${id}`;
        mysqlConnection.query(sqlQuery,(err,row)=>{
            if(err){
                res.status(400).json({
                    sucess:false,
                    message:err,
                });
            }
            else{
                res.status(200).json(row);
            }
        })
    }else{
        res.status(400).json({
            sucess:false,
            message:"Valid id is required"
        })
    }
})


app.delete("/delete/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    if(!isNaN(id)){
        const sqlQuery = `DELETE FROM userinfo WHERE userId=${id}`;
        mysqlConnection.query(sqlQuery,(err,row,field)=>{
            if(err){
                res.status(500).json({
                    sucess:false,
                    message:err,
                });
            }
            else{
                res.status(200).json({
                    sucess:true,
                    message:`User with ${id} is deleted`
                });
            }
        })
    }else{
        res.status(500).json({
            sucess:false,
            message:"Valid id is required"
        });
    }
});


app.put("/update/:id",(req,res)=>{
    const {userName,userAge}=req.body;
    const id = parseInt(req.params.id);
    if(userName){
        if(!isNaN(id) && !isNaN(parseInt(userAge))){
            const sqlQuery = `UPDATE userinfo SET userName = '${userName}', userAge = ${userAge} WHERE userId = ${id};`
            console.log(sqlQuery);
            mysqlConnection.query(sqlQuery,(err,row,field)=>{
                if(err){
                    res.status(500).json({
                        sucess:false,
                        message:`User doesnot exits with id ${id}`,
                    })
                }else{
                    res.status(200).json({
                        sucess:true,
                        message:`User details with id ${id} updated`
                    });
                }
            })
        }else{
            res.status(400).json({
                sucess:false,
                messsage:"Vaild id is required"
            });
        }
    }else{
        res.status(500).json({
            sucess:false,
            message:"Username and Useraddress are required"
        });
    }
})

app.listen(3000,()=>{
    mysqlConnection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"poudeL46@",
        database:"userdetails"
    });
})