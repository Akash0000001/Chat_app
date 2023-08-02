const email=document.getElementById("email")
const password=document.getElementById("password")
const form=document.getElementById("form")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    e.preventDefault();
    try{
        const res=await axios.post("http://localhost:3000/user/login",{email:email.value , password:password.value})
        console.log(res)
    }
    catch(err)
    {
        console.log(err)
    }
}