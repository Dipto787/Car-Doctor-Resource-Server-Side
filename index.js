let express=require('express');
let cors=require('cors');
let app=express();
let port=process.env.PORT||5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get('/',(req,res)=>{
        res.send('car doctor resource is running')
})

app.listen(port,()=>{
    console.log(`let star our server is ${port} n.o`)
})