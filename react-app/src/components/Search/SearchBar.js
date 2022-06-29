import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { createOneChannel, getAllChannels } from "../../store/channels"
import { useHistory } from "react-router-dom"

function SearchBar() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [query, setQuery] = useState("")
    const allUsers = useSelector((state) => state.search);
    const users = Object.values(allUsers);

    const userChannels = useSelector((state) => state.channels);
    const channels = Object.values(userChannels);

    const userId = useSelector((state) => state.session.user.id);

    let exist = false;
    let channelId;
    const name = `private for ${userId}`
    const description = `dm description ${userId}`
    const private_chat = true

    const newDM = async (id, e) => {
        e.preventDefault()
        const payload = {
            name,
            description,
            private_chat,
            owner_id: userId,
            members: id
        }

        const createdDM = await dispatch(createOneChannel(userId, payload))
        if (createdDM) {
            await dispatch(getAllChannels(userId))
            history.push(`/users/${userId}/${createdDM.id}`)
        }
    }
    console.log('search area')
    const filterUsers = (users, query) => {
        if (!query) {
            return users;
        }
        return users.filter((user) => {
            const fullName = `${user.first_name.toLowerCase()} ${user.last_name.toLowerCase()}`;
            return fullName.includes(query.toLowerCase());
        })
    }
    const filteredUsers = filterUsers(users, query);


    return (
        <div>
            <form>
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onInput={e => setQuery(e.target.value)}
                />
            </form>
            <ul className="filtered-list" >
                {query ? filteredUsers.map(user => {
                    channels.forEach(channel => {
                        if (channel.members.length === 2) {
                            channel.members.forEach(member => {
                                if (member.id === user.id && channel.private === true) {
                                    exist = true;
                                    channelId = channel.id
                                }
                            })
                        }
                        {
                            exist ?
                                <NavLink to={`/users/${userId}/${channelId}`} key={user.id}><div>{user.first_name} {user.last_name}</div></NavLink>
                                :
                                <div key={user.id} onClick={() => newDM(user.id)}>{user.first_name} {user.last_name}</div>
                        }
                    })
                }) : null}

            </ul>
        </div>
    )
}

export default SearchBar;
