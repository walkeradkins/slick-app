import './ChatBox.css'
import MessageInput from '../MessageInput/';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Redirect } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getAllChannels } from '../../store/channels';
import { getAllMessages } from '../../store/messages';
import EditChannelModal from '../EditChannelModal';
import MessageContent from '../MessageContent'
import EditDMModal from '../EditDMs';
import { deleteChannel } from '../../store/channels';
import { io } from 'socket.io-client';
import Typing from '../Typing'

let socket;

const ChatBox = () => {
  const dispatch = useDispatch()
  const history = useHistory();
  const bottomRef = useRef(null);
  const { channelId, userId } = useParams()
  const allMessages = useSelector((state) => state.messages);
  const channels = useSelector((state) => state.channels);
  const logInId = useSelector((state) => state.session.user.id);
  const currentChannel = channels[channelId];

  const messages = Object.values(allMessages);
  const [deleted, setDeleted] = useState(false);
  const [messageReceived, setMessageReceived] = useState('')
  const [updateComplete, setUpdateComplete] = useState('')
  const [messageUpdated, setMessageUpdated] = useState('')
  const [prevMessage, setPrevMessage] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [onDelete, setOnDelete] = useState(false)
  const [owner, setOwner] = useState(false)
  const [typing, setTyping] = useState(false)
  const [otherTyping, setOtherTyping] = useState('')
  const [userTyping, setUserTyping] = useState('')

  let privateMembers;

  if (currentChannel?.private_chat) {
    privateMembers = currentChannel.members.filter(user =>
      +user.id !== +userId
    ).map(user => `${user.first_name} ${user.last_name}`).join(', ')
  }

  useEffect(() => {
    dispatch(getAllChannels(userId));
    if (channelId) {
      dispatch(getAllMessages(userId, channelId))
    }
    setOwner(currentChannel?.owner_id === parseInt(userId))
  }, [dispatch, userId, channelId, messageReceived, updateComplete, onDelete, deleted]);

  let timeout;
  clearTimeout(timeout)

  if (otherTyping.typing) {
    timeout = setTimeout(() => {
      setTyping(false);
    }, 3000);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dispatch, channelId, messageReceived]);

  useEffect(() => {
    socket = io();

    socket.emit('typing', {
      id: userTyping.id,
      userName: `${userTyping.first_name} ${userTyping.last_name}`,
      typing: typing > 1,
      channel: currentChannel?.id
    })

    clearTimeout(timeout)

    socket.on('typing', (data) => {
      setOtherTyping(data)
      clearTimeout(timeout)
    })

    // socket.emit('update', {
    //   old_message: prevMessage,
    //   new_message: messageUpdated
    // })

    // socket.on('update', (data) => {
    //   setMessageUpdated(data.new_message)
    // })

    socket.emit('chat', createMessage)
    socket.on("chat", (data) => {
      setMessageReceived(data)
      // if (channels[messageReceived.channel_id]) {
      //   channels[messageReceived.channel_id]['notify'] = true
      //   setNotification(channels[messageReceived.channel_id])
      //   console.log('notification', notification)
      // }
    })

    socket.emit('delete')
    socket.on("delete", (data) => {
      setOnDelete(false)
    })
    return (() => {
      socket.disconnect()
    })
  }, [updateComplete, createMessage, onDelete, typing, userTyping])

  const removingChannel = async (deletechannelId) => {

    let deletedChannel;
    try {
      deletedChannel = await dispatch(deleteChannel(deletechannelId));

    } catch (error) {
      alert(error)
    }

    if (deletedChannel) {
      setDeleted(true)
      if (deletedChannel.id === parseInt(channelId)) {
        history.push(`/users/${logInId}`)
      }
    }
    setDeleted(false)

  }

  if (!Object.keys(channels).length) return null;

  if (!currentChannel) {
    return (
      <Redirect to={`/users/${logInId}`} />
    )
  }

  return (
    <div className='chatbox'>
      <div className='chatbox__header'>
        <div className='chatbox__header--text-container'>
          <h2 className='chatbox__header--text'>
            {privateMembers ?
              (`${privateMembers}`) :
              <div className='chatbox__header--text-container-icons'>
                <span className="material-symbols-outlined">
                  tag
                </span>
                {currentChannel.name}
              </div>
            }
          </h2>
        </div>
        <div className='chatbox__header--icon-container'>
          <h2>{
            owner &&
            currentChannel.private_chat &&
            <EditDMModal
              channelId={currentChannel.id}
            />}
          </h2>
          <div className='chatbox__header--buttons-container'>
            <h2 className='h2__edit'>{
              owner &&
              !currentChannel.private_chat &&
              <EditChannelModal
                channelId={currentChannel.id}
                userId={userId}
                owner_id={currentChannel.owner_id}
              />}
            </h2>
            <h2 className='h2__delete'>
              {+userId === +currentChannel.owner_id &&
                !currentChannel.private_chat &&
                <button
                  className='chatbox__header--buttons'
                  onClick={() => removingChannel(currentChannel.id)}
                  style={{ cursor: "pointer" }}>
                  <span className="material-symbols-outlined">
                    delete
                  </span>
                </button>}
            </h2>
          </div>

        </div>
      </div>
      <div className='chatbox__messages'>
        <ul className="chatbox__messages--list" style={{ listStyleType: "none" }}>
          {messages.map(message =>
            <li className="one-message" key={`message-${message.id}`}>
              <MessageContent
                message={message}
                setUpdateComplete={setUpdateComplete}
                setOnDelete={setOnDelete}
                setMessageUpdated={setMessageUpdated}
                setPrevMessage={setPrevMessage}
              />
            </li>
          )}
        </ul>
        <div ref={bottomRef} />
      </div>
      <div className='chatbox__input'>
        {otherTyping.typing &&
          +otherTyping.id !== +userId &&
          +otherTyping.channel == +currentChannel.id &&
          <div className='chatbox__typing--container'>
            <Typing person={otherTyping.userName} />
          </div>
        }
        <MessageInput
          setMessageReceived={setMessageReceived}
          setCreateMessage={setCreateMessage}
          setTyping={setTyping}
          setUserTyping={setUserTyping}
        />
      </div>
    </div>
  );
}


export default ChatBox;
