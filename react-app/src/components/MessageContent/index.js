import './MessageContent.css'
import MessageInput from '../MessageInput/';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { updateMessage, deleteMessage, getAllMessages } from '../../store/messages';
import MessageUserIcon from '../MessageUserIcon';


const MessageContent = ({ message, setUpdateComplete, setOnDelete }) => {
  const { channelId, userId } = useParams()
  const dispatch = useDispatch();
  const allMessages = useSelector((state) => state.messages);
  const allUsers = useSelector((state) => state.search);
  const user = useSelector((state) => state.session.user)
  const [originalContent, setOriginalContent] = useState(message.content)
  const [content, setContent] = useState(message.content)
  const [edit, setEdit] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const [rowValue, setRowValue] = useState(5)
  const [textareaHeight, setTextareaHeight] = useState(message.content.length < 600 ?
   6 : message.content.length / 131);
  // const [messageUpdated, setMessageUpdated] = useState('')

  useEffect(() => {
    dispatch(getAllMessages(user.id, channelId))
    return () => {
      setDeleted(false)
    }
  }, [deleted]);

  const handleEdit = (e) => {
    e.preventDefault()
    setEdit(!edit)
  }

  const handleDelete = async (e) => {
    e.preventDefault()

    let deletedMessage;
    try {
      deletedMessage = await dispatch(deleteMessage(message.id));
    } catch (error) {
      alert(error)
    }

    if (deletedMessage) {
      setDeleted(true)
      setOnDelete(true)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const payload = {
      content,
      owner_id: message.owner_id,
      channel_id: message.channel_id,
      created_at: message.created_at,
      updated_at: new Date()
    }

    let updatedMessage;

    try {
      updatedMessage = await dispatch(updateMessage(payload, message.id));
    } catch (error) {
      alert(error)
    }

    if (updatedMessage) {
      setEdit(true);
      setOriginalContent(updatedMessage.content);
      setUpdateComplete(updatedMessage)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault()
    setEdit(true)
    setContent(message.content)
  }

  const handleChange = (e) => {
    setContent(e.target.value)
    const height = e.target.scrollHeight;
    let value = e.target.value.length
    const rowHeight = 15
    const trows = Math.ceil(value / 140) - 1;
    console.log('trows:: ', trows)
    console.log('char count:: ', value)
    console.log('row value:: ', rowValue)
    if (trows > rowValue) {
      setTextareaHeight(textareaHeight + 1);
      setRowValue(trows);
    }

    if (trows < rowValue) {
      setTextareaHeight(Math.ceil(value / 120));
      setRowValue(trows);
      if (!trows) trows = 5;
    }
  }
  // const timeString = message.created_at.slice(17, 25)
  const time = new Date(message.created_at)

  const convertedTimeString = time.toLocaleTimeString('en-US',
    { hour12: true, hour: 'numeric', minute: 'numeric' });

  return (
    <div
      className={edit ? 'message__container' : 'message__container--edit'}
      onMouseEnter={() => setShowTools(true)}
      onMouseLeave={() => setShowTools(false)}
    >
      <div className='message__icon--name'>
        <MessageUserIcon memberImage={allUsers[message.owner_id].profile_img} />
        <p className='message__user--name'>{allUsers[message.owner_id].first_name} {allUsers[message.owner_id].last_name}</p>
        <p className='message__user--time'>{convertedTimeString}</p>
      </div>
      <form>
        <div className={edit ? 'message__textarea--container--inactive' : 'message__textarea--container'}>
          <textarea
            rows={textareaHeight}
            className={edit ? 'input__inactive' : 'input__active'}
            value={content}
            autofocus
            onChange={handleChange}
            disabled={edit}
          />
          {edit && showTools &&
            <div className='message__tools--container'>
              {user.id === message.owner_id &&
                <button
                  className='message__tools-btn'
                  onClick={handleEdit}
                  type='submit'>
                  <span
                    class="material-symbols-outlined message__tools--tool-icons">
                    edit
                  </span>
                </button>}
              {user.id === message.owner_id &&
                <button
                  className='message__tools-btn'
                  onClick={handleDelete}
                  type='submit'>
                  <span
                    class="material-symbols-outlined message__tools--tool-icons">
                    delete
                  </span>
                </button>}
            </div>
          }
          {!edit &&
            <div className='message__edits--container'>
              {user.id === message.owner_id &&
                <button
                  className='message__edit--btn message__edit--btn-save'
                  onClick={handleSave} type='submit'>
                  Save
                </button>}
              {user.id === message.owner_id &&
                <button
                  className='message__edit--btn message__edit--btn-cancel'
                  onClick={handleCancel}
                  type='submit'>
                  Cancel
                </button>}
            </div>
          }
        </div>
      </form>
    </div>
  );
}

export default MessageContent;