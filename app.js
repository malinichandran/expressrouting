const express = require('express');
const ExpressError = require("./expressError")
const app = express();

app.use(express.json());



app.get('/mean', (req, res, next)=>{
   
    let values = Object.values(req.query).toString().split(',')
    if(values.length===0){
        return next();
    }
    
    let arr = [];

    for(val of values){
        arr.push(Number(val));    
    }
    if(arr.includes(NaN)){
        return next();
    }
    let reducer = (acc,curr)=>{
        return acc+curr;
    }
    let mean = Math.floor(arr.reduce(reducer)/arr.length)
    return res.json({operation: "mean", value: mean})
})

app.get('/median', (req, res, next)=>{
    let values = Object.values(req.query).toString().split(',')
    if(values.length===0){
        return next();
    }
    let arr = [];
    for(val of values){
        arr.push(Number(val));    
    }
    if(arr.includes(NaN)){
        return next();
    }
    let result = 0;
    let sortedArr =  arr.sort();
    const middle = Math.floor(sortedArr.length / 2);

    if (sortedArr.length % 2 === 0) {
        result = (sortedArr[middle - 1] + sortedArr[middle]) / 2;
        
    }
    else{
        result =  sortedArr[middle];
    }
return res.json({operation: "median", value: result})
});

app.get('/mode', (req, res, next)=>{
    let values = Object.values(req.query).toString().split(',')
    if(values.length===0){
        return next();
    }
    let arr = [];
    for(val of values){
        arr.push(Number(val));    
    }
    if(arr.includes(NaN)){
        return next();
    }
    
        arr.sort((x, y) => x - y);
      
        let bestStreak = 1;
        let bestElem = arr[0];
        let currentStreak = 1;
        let currentElem = arr[0];
      
        for (let i = 1; i < arr.length; i++) {
          if (arr[i-1] !== arr[i]) {
            if (currentStreak > bestStreak) {
              bestStreak = currentStreak;
              bestElem = currentElem;
            }
      
            currentStreak = 0;
            currentElem = arr[i];
          }
      
          currentStreak++;
        }
      
        let result = currentStreak > bestStreak ? currentElem : bestElem;
    
      
    return res.json({operation: "mode", value: result })
});


app.use((req, res, next)=>{
    const notANumError = new ExpressError("Please enter only numbers", 400);
    return next(notANumError)
});

app.use((req, res, next)=>{
    const noNumError = new ExpressError("Nums are required", 400);
    return next(noNumError);
});

app.use((err, req, res, next)=>{
    let status = err.status || 500;
    let message = err.message;
    return res.status(status).json({
        error: {message, status}
    });
});

app.listen(3000, function(){
    console.log('Server is listening on port 3000')
})

