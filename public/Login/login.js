const email=document.getElementById("email")
const password=document.getElementById("password")
const form=document.getElementById("form")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    e.preventDefault();
    try{
        
        const res=await axios.post("http://3.110.88.239:3000/user/login",{email:email.value , password:password.value})
        localStorage.setItem("token",res.data.token)
        alert(res.data.message)
        window.location.href="/index.html"
    }
    catch(err)
    {
        console.log(err)
        document.getElementById("errmsg").textContent=err.message
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
}
