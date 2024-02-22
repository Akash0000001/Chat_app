const name=document.getElementById("name");
const email=document.getElementById("email");
const password=document.getElementById("password")
const form=document.getElementById("form")

form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    try{
    e.preventDefault();
    const res =await axios.post("http://3.110.88.239:3000/user/signup",{name:name.value,email:email.value,password:password.value})
    if(res.status===201)
    {
        alert(res.data.message)
    }
    else{
        alert(res.data.message)
        window.location.href="/Login/login.html"
    }
    }
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something went wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }

}
