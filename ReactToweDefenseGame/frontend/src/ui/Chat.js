const Chat = (props) => {
    const id = props.id
    
    const sendMessage = () => {
        const text = document.getElementById('message').value
        const time = new Date().toLocaleTimeString()
        props.client.publish('chat', `${time} ${id}: ${text}`)
        document.getElementById('message').value = ''
    }

    const changeNick = () => {
        const nick = document.getElementById('nick').value
        props.client.publish('chat', `user ${id} is now ${nick}`)
        props.setId(nick)
    }

    return <div className="main">
        <div className='title'>Chat with other players!</div>
        <div className='send'>
            <input id='nick' defaultValue={id}/>
            <div className='button' onClick={()=>{changeNick()}}>change nick</div>
        </div>
        <ul id='list' className='chat'/>
        <div className='send'>
            <input id='message'/>
            <div className='button' onClick={()=>{sendMessage()}}>send</div>
        </div>
    </div>
}

export default Chat