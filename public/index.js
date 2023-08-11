const chatList=document.getElementById("chatlist")
const sentMessage=document.getElementById("message")
const form=document.getElementById("form")
function showChatsOnScreen(chat)
{
    const chatListItem=document.createElement("li")
    chatListItem.id=chat.id
    chatListItem.className="list-group-item"
    chatListItem.appendChild(document.createTextNode(`${chat.user.name}: ${chat.message}`))
    chatList.appendChild(chatListItem)
}
form.addEventListener("submit",onsubmit)

async function onsubmit(e)
{
    e.preventDefault();
   try{
    const token= localStorage.getItem("token")
    const res=await axios.post("http://localhost:3000/chats",{message:sentMessage.value},{headers:{"Authorization":token}})
    console.log(res)
    const {chat,user}=res.data
    showChatsOnScreen({...chat,user})
    
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
    console.log(res)
    res.data.forEach(data=>showChatsOnScreen(data))
    }
    catch(err)
    {
        console.log(err)
    }
})
