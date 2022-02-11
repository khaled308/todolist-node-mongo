const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/toDoList')


//create collection
const options = {task:String,status:Number}
const TaskSchema = new mongoose.Schema(options)
const Task = mongoose.model('Task',TaskSchema)



const app = express()
app.set('view engine' , 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/',async(req,res)=>{
    const data = await Task.find().select({ _id : false,__v: false })
    res.render('index',{data})
})

app.post('/',async(req,res)=>{
    const item = req.body.field
    const status = 0
    //db
    const task = new Task({task : item,status})
    task.save()
    res.json({item})
})

app.post('/update',(req,res)=>{
    Task.updateOne({task:req.body.field},{status:req.body.status},err=>{
        if(err){
            res.send({'status':false})
        }
        else{
            res.send({'status':true})
        }
    })
})


app.post('/delete',(req,res)=>{
    Task.deleteOne({task:req.body.field},err=>{
        if(err){
            res.send({'status':false})
        }
        else{
            res.send({'status':true})
        }
    })
})

app.listen(3000)