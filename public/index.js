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
    sentMessage.value=""
    console.log(res)
    
   }
   catch(err) 
   {
    console.log(err)
   }

}

window.addEventListener('DOMContentLoaded',async () =>{
    try{
    let oldmessages=JSON.parse(localStorage.getItem("messages"))
    let lastMessageId
    if(oldmessages)
    {
    lastMessageId=oldmessages[oldmessages.length-1].id
    }
    else
    {
    lastMessageId=-1
    oldmessages=[]
    }
    const token=localStorage.getItem("token")
    const res=await axios.get(`http://localhost:3000/chats?lastMessageId=${lastMessageId}`,{headers:{Authorization:token}})
    console.log(res)
    let  mergeMessagedArray=oldmessages.concat(res.data)
    if(mergeMessagedArray.length>10)
    {
        mergeMessagedArray=mergeMessagedArray.slice(mergeMessagedArray.length-10)
    }
    localStorage.setItem("messages",JSON.stringify(mergeMessagedArray))
    JSON.parse(localStorage.getItem("messages")).forEach(data=>showChatsOnScreen(data))
    }
    catch(err)
    {
        console.log(err)
    }
})
setInterval(async ()=>{
    try{
        let lastMessageId
        if(chatList.lastElementChild)
        {
            lastMessageId=chatList.lastElementChild.id
        }
        else
        {
            lastMessageId=-1
        }
        const token=localStorage.getItem("token")
        const res=await axios.get(`http://localhost:3000/chats?lastMessageId=${chatList.lastElementChild.id}`,{headers:{Authorization:token}})
        //chatList.innerHTML=""
        console.log(res)
        res.data.forEach(data=>showChatsOnScreen(data))
        }
        catch(err)
        {
            console.log(err)
        }
},1000)
