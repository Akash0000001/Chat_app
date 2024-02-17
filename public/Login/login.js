const email=document.getElementById("email")
const password=document.getElementById("password")
const form=document.getElementById("form")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    e.preventDefault();
    try{
        
        const res=await axios.post("http://localhost:300/user/login",{email:email.value , password:password.value})
        localStorage.setItem("token",res.data.token)
        alert(res.data.message)
        window.location.href="/index.html"
    }
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something Went Wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
}