const email=document.getElementById("email")
const password=document.getElementById("password")
const form=document.getElementById("form")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    e.preventDefault();
    try{
        
        const res=await axios.post("http://3.110.88.239:3000/user/login",{email:email.value , password:password.value})
        if(res.status===200)
        {
        localStorage.setItem("token",res.data.token)
        alert(res.data.message)
        window.location.href="/index.html"
        }
        else{
            alert(res.data.message)
        }
    }
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something went wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
}
