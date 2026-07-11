const client = io("http://localhost:3000/" , {
    auth : {
        authorization : "User eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhM2UwY2MxYmRmYjUwOTJhZmNjZjk1OCIsImp0aSI6ImUxNDU0YzAyLTMwZjEtNDA5Ni04MTM5LTRkZDMyYjk5NWYzNCIsImlhdCI6MTc4Mzc2NDE3NiwiZXhwIjoxNzgzNzY3Nzc2fQ.uFhrYtlWsx7w-NSJ28CqBtm4AIYF5i9gA8b-d1blauo"
    }
})

client.on("connect" , () =>{
    console.log("Server Established connection successfully");
    
})

client.on("product" , (data ,callback) =>{
    console.log({data});
    callback("Hi from FE I recieved Your message")
    
})