const client = io("http://localhost:3000/")

client.on("connect" , () =>{
    console.log("Server Established connection successfully");
    
})

client.on("product" , (data) => {
    console.log({data});
    
})

client.emit("sayHi" , "Hello from Socket Client to Backend Server" , (res) =>{
    console.log({res});
    
});