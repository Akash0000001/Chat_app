const groupList=document.getElementById("grouplist")
const sentMessage=document.getElementById("message")
const createGroup=document.getElementById("groupbutton-1")
const createGroupContainer=document.getElementById("creategroup")
const token=localStorage.getItem("token")
let id


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
async function addmsg(e)
        {
            e.preventDefault()
            try{
                const msg=document.getElementById("message")
                const res=await axios.post("http://localhost:3000/chats",{message:msg.value,groupId:id},{headers:{Authorization:token}})
                msg.value=""
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }

    async function addmember(e)
        {
            e.preventDefault()
            try{
                const email=document.getElementById("addMember")
                const res=await axios.post("http://localhost:3000/groups/addMember",{email:email.value,groupId:id},{headers:{Authorization:token}})
                email.value=""
                document.getElementById("addMembermsg").textContent=res.data
                setTimeout(()=>document.getElementById("addMembermsg").innerHTML="",10000)
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }
        async function makeadmin(e)
        {
            e.preventDefault()
            try{
                const email=document.getElementById("makeAdmin")
                const res=await axios.post("http://localhost:3000/groups/makeAdmin",{email:email.value,groupId:id},{headers:{Authorization:token}})
                email.value=""
                document.getElementById("makeAdminmsg").textContent=res.data
                setTimeout(()=>document.getElementById("makeAdminmsg").innerHTML="",10000)
            }
            catch(err)
            {
                console.log(err)
            }

        }
        async function removemember(e)
        {
            e.preventDefault()
            try{
                const email=document.getElementById("removeMember")
                const res=await axios.post("http://localhost:3000/groups/removeMember",{email:email.value,groupId:id},{headers:{Authorization:token}})
                email.value=""
                document.getElementById("removeMembermsg").textContent=res.data
                setTimeout(()=>document.getElementById("removeMembermsg").innerHTML="",10000)
            }
            catch(err)
            {
                document.getElementById("errmsg").textContent="Something Went Wrong"
                setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
            }

        }

window.addEventListener("DOMContentLoaded",async () =>{
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
    const res=await axios.get("http://localhost:3000/groups?lastGroupId=-1",{headers:{Authorization:token}})
    res.data.forEach(group=>showgroupsonscreen(group))

}
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something Went Wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
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
        const res=await axios.post("http://localhost:3000/groups/create",{groupName:groupName.value},{headers:{Authorization:token}})
        createGroupContainer.textContent=`${groupName.value} group is created`
        setTimeout(()=>createGroupContainer.innerHTML="",10000)
    }
    catch(err)
    {
        document.getElementById("errmsg").textContent="Something Went Wrong"
        setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
    }
}



groupList.addEventListener("click",async(e)=>{
try{
    if (e.target.value==="Open")
    {
        id=e.target.parentElement.id
        const token=localStorage.getItem("token")
        const res=await axios.get(`http://localhost:3000/chats?groupId=${id}&lastMessageId=-1`,{headers:{Authorization:token}})
        const ul=document.createElement("ul")
        const li=document.createElement("li")
        li.className="list-group-item"
        li.innerHTML="<form id='formMsg' onsubmit='addmsg(event)'><input type='text' placeholder='type a message' id='message' required><input type='submit' value='Send Message'></form>"
        ul.appendChild(li)
        if (res.data.admin===true)
        {
            const li=document.createElement("li")
            li.className="list-group-item"
            li.innerHTML="<form id='formAdd'onsubmit='addmember(event)'><input type='text'placeholder='Enter Email to add member' id='addMember' required><input type='submit' value='Add Member'></form><br><p id='addMembermsg'></p><form id='formAdmin'onsubmit='makeadmin(event)'><input type='text'placeholder='Enter Email to make member an admin' id='makeAdmin' required><input type='submit' value='Make Admin'></form><br><p id='makeAdminmsg'></p><form id='formremove'onsubmit='removemember(event)'><input type='text'placeholder='Enter Email to remove member' id='removeMember' required><input type='submit' value='Remove Member'></form><br><p id='removeMembermsg'></p>" 
            ul.appendChild(li)
        }
        e.target.parentElement.appendChild(ul)
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
    e.target.parentElement.appendChild(chatList)

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
                const res=await axios.get(`http://localhost:3000/chats?groupId=${id}&lastMessageId=${lastMessageId}`,{headers:{Authorization:token}},{groupId:e.target.parentElement.id})
                //chatList.innerHTML=""
                console.log(res)
                res.data.chats.forEach(data=>showChatsOnScreen(data))
                }
                catch(err)
                {
                    document.getElementById("errmsg").textContent="Something Went Wrong"
                    setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
                }
        },1000)
    }
}
catch(err)
{
    document.getElementById("errmsg").textContent="Something Went Wrong"
    setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
}
})


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
        res.data.forEach(data=>showgroupsonscreen(data))
        }
        catch(err)
        {
            document.getElementById("errmsg").textContent="Something Went Wrong"
            setTimeout(()=>document.getElementById("errmsg").firstChild.remove(),10000)
        }}
        ,1000)