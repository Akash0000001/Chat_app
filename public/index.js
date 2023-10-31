const groupList=document.getElementById("grouplist")
const sentMessage=document.getElementById("message")
const createGroup=document.getElementById("groupbutton-1")
const createGroupContainer=document.getElementById("creategroup")
const token=localStorage.getItem("token")



function showgroupsonscreen(group)
{
    const groupListItem=document.createElement("li")
    groupListItem.id=group.id
    groupListItem.className="list-group-item"
    groupListItem.appendChild(document.createTextNode(`${group.name}`))
    const groupButton=document.createElement("button")
    groupButton.setAttribute("value","Open")
    groupButton.appendChild(document.createTextNode("Open"))
    groupListItem.appendChild(groupButton)
    groupList.appendChild(groupListItem)
}



window.addEventListener('DOMContentLoaded',async () =>{
    try{
        
    // let oldmessages=JSON.parse(localStorage.getItem("messages"))
    // let lastMessageId
    // if(oldmessages)
    // {
    // lastMessageId=oldmessages[oldmessages.length-1].id
    // }
    // else
    // {
    // lastMessageId=-1
    // oldmessages=[]
    // }
     
    // const res=await axios.get(`http://localhost:3000/chats?lastMessageId=${lastMessageId}`,{headers:{Authorization:token}})
    // console.log(res)
    // let  mergeMessagedArray=oldmessages.concat(res.data)
    // if(mergeMessagedArray.length>10)
    // {
    //     mergeMessagedArray=mergeMessagedArray.slice(mergeMessagedArray.length-10)
    // }
    // localStorage.setItem("messages",JSON.stringify(mergeMessagedArray))
    // JSON.parse(localStorage.getItem("messages")).forEach(data=>showChatsOnScreen(data))
    const res=await axios.get("htttp://localhost:3000/groups",{headers:{Authorization:token}})
    res.data.forEach(group=>showgroupsonscreen(group))

}
    catch(err)
    {
        console.log(err)
    }
})

createGroup.addEventListener("click",async()=>{
    createGroupContainer.innerHTML="<form id='creategroupform'><input type='text' id='groupname' placeholder='Enter Group Name'><input type='submit' value='Create Group'></form>"
    document.getElementById("creategroupform").addEventListener("submit",creategroup)
})


async function creategroup(e)
{
    e.preventDefault()
    try{
        const groupName=document.getElementById("groupname")
        const res=axios.post("http://localhost:3000/groups/create",{groupName:groupName.value},{headers:{Authorization:token}})
    }
    catch(err)
    {
        console.log(err)
    }
}



groupList.addEventListener("click",async(e)=>{
    if (e.target.value==="Open")
    {
        const res=await axios.get(`http://localhost:3000/chats?name=akash`,{headers:{Authorization:token}},{groupId:e.target.parentElement.id})
        const ul=document.createElement("ul")
        const li=document.createElement("li")
        li.innerHtml="<form id='form'><input type='text' class='form-control' placeholder='type a message' id='message' required><input type='submit' value='Send Message' class='btn btn-primary' style='margin-left:10px;'>"
        ul.appendChild(li)
        if (res.data.admin===true)
        {
            const li=document.createElement("li")
            li.innerHtml="<form id='form'><input type='text' class='form-control' placeholder='Enter Email to add member' id='addMember' required><input type='submit' value='Add Member' class='btn btn-primary' style='margin-left:10px;'>" 
            ul.appendChild(li)
        }
        const chatList=document.createElement("ul")
        res.data.chats.forEach(chat=>showChatsOnScreen(chat))
        
        function showChatsOnScreen(chat)
    {
        const chatListItem=document.createElement("li")
        chatListItem.id=chat.id
        chatListItem.className="list-group-item"
        chatListItem.appendChild(document.createTextNode(`${chat.user.name}: ${chat.message}`))
        chatList.appendChild(chatListItem)
    }

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
                const res=await axios.get(`http://localhost:3000/chats?lastMessageId=${chatList.lastElementChild.id}`,{headers:{Authorization:token}},{groupId:e.target.parentElement.id})
                //chatList.innerHTML=""
                console.log(res)
                res.data.chats.forEach(data=>showChatsonScreen(data))
                }
                catch(err)
                {
                    console.log(err)
                }
        },1000)
        
    }
} )


setInterval(async ()=>{
    try{
        let lastGroupId
        if(groupList.lastElementChild)
        {
            lastGroupId=groupList.lastElementChild.id
        }
        else
        {
            lastGroupId=-1
        }
        const token=localStorage.getItem("token")
        const res=await axios.get(`http://localhost:3000/groups?lastGroupId=${lastGroupId}`,{headers:{Authorization:token}})
        //chatList.innerHTML=""
        console.log(res)
        res.data.forEach(data=>showgroupsonscreen(data))
        }
        catch(err)
        {
            console.log(err)
        }}
        ,1000)