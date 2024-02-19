const name=document.getElementById("name");
const email=document.getElementById("email");
const password=document.getElementById("password")
const form=document.getElementById("form")
import {io} from "socket.io-client"

io.on("http://localhost:3000")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    try{
    e.preventDefault();
    const res =await axios.post("http://localhost:3000/user/signup",{name:name.value,email:email.value,password:password.value})
    if(res.status===201)
    {
        alert(res.data.message)
    }
    else{
        alert(res.data.message)
        window.location.href="/Login/login.html"
    }
    console.log(res)
    }
    catch(err)
    {
        console.log(err)
    }

}
