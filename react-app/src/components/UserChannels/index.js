import './UserChannels.css'
import CreateChannelModal from '../ChannelModal'
import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllChannels } from '../../store/channels';
import { getAllMessages } from '../../store/messages';

const UserChannels = () => {
  const { userId, channelId } = useParams();
  const dispatch = useDispatch();

  const allChannels = useSelector((state) => state.channels);
  const allUsers = useSelector((state) => state.search);
  const channels = Object.values(allChannels);
  const logInId = useSelector((state) => state.session.user.id)
  const [hoverDisplay, setHoverDisplay] = useState(false)

  useEffect(() => {
    dispatch(getAllChannels(logInId));
    if (channelId) {
      dispatch(getAllMessages(logInId, channelId))
    }
  }, [dispatch, logInId, channelId]);

  if (!Object.keys(allUsers).length) return null;

  return (
    <div className='main-channels__header-container'>
      <div className='channels__header-container'
        onMouseEnter={(e) => setHoverDisplay(true)}
        onMouseLeave={(e) => setHoverDisplay(false)}
      >
        <p className='channels__header-text'>Channels</p>
        <CreateChannelModal hoverDisplay={hoverDisplay} />
      </div>
      <ul className="view-channels" style={{ listStyleType: "none" }}>
        {channels.map(channel =>
          !channel.private_chat &&
          <NavLink key={channel.id} activeClassName="blue" activeStyle={{
            backgroundColor: '#15D4FF',
            color: 'white'
          }} exact to={`/users/${userId}/${channel.id}`} style={{ textDecoration: "none", color: "black" }}  >
            <div className='one-channel-container' >
              <li className="one-channel" key={`channel-${channel.id}`}>
                <span className='hashtag-channels'>
                  <span className="material-symbols-outlined hashtag__icon">
                    tag
                  </span>
                  {`${channel.name}`}
                </span>
              </li>
            </div>
          </NavLink>
        )}
      </ul>
    </div>
  );
}

export default UserChannels;
