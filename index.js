const chatList=document.getElementById("chatlist")
const sentMessage=document.getElementById("message")
const form=document.getElementById("form")
function showChatsOnScreen(chat)
{
    const chatListItem=document.createElement("li")
    chatListItem.id=chat.id
    chatListItem.className="list-group-item"
    chatListItem.appendChild(document.createTextNode(`${chat.message}`))
}
form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
   try{
    const token= localStorage.getItem("token")
    const res=await axios.post("http://localhost:3000/chats",{message:sentMessage},{headers:{"Authorization":token}})
    showChatsOnScreen(res.data)
   }
   catch(err) 
   {
    console.log(err)
   }

}

window.addEventListener('DOMContentLoaded',async () =>{
    try{
    const token=localStorage.getItem("token")
    const res=await axios.get("http://localhost:3000/chats",{headers:{Authorization:token}})
    res.forEach(data=>showChatsOnScreen(data))
    }
    catch(err)
    {
        console.log(err)
    }
})
