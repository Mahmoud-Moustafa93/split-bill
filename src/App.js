import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    fname: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    fname: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    fname: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

/*
1- Build the static part of the App
2- Build the dynamic part of the App
  a- Create the state variable using the useState() hook
  b- Use the state variable
  c- Update the state variable by using an event handler
*/

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  function handleAddFriend(friend) {
    setFriends((prevFriends) => [...prevFriends, friend]);
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button
          onClickHandler={() => {
            setShowAddFriend(!showAddFriend);
          }}
        >
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      <FormSplitBill />
    </div>
  );
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li key={friend.id}>
      <img src={friend.image} alt={friend.fname} />
      <h3>{friend.fname}</h3>

      {friend.balance > 0 && (
        <p className="green">
          {friend.fname} owes you {friend.balance}€
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.fname} {friend.balance * -1}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.fname} are even</p>}

      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!friendName || !friendImage) return;

    let pravatar = true;
    if (friendImage !== "https://i.pravatar.cc/48") pravatar = false;

    const newId = crypto.randomUUID();
    const newFriend = {
      id: newId,
      fname: friendName,
      image: pravatar ? `${friendImage}?=${newId}` : friendImage,
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        required
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={friendImage}
        onChange={(e) => setFriendImage(e.target.value)}
        required
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with Anthony</h2>
      <label>💰 Bill value</label>
      <input type="number" min="0" />

      <label>🧍‍♀️ Your expense</label>
      <input type="number" min="0" />

      <label>👫 Anthony's expense</label>
      <input type="number" min="0" disabled />

      <label>🤑 Who is paying the bill?</label>
      <select>
        <option value="user">You</option>
        <option value="friend">Anthony</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function Button({ onClickHandler, children }) {
  return (
    <button className="button" onClick={onClickHandler}>
      {children}
    </button>
  );
}

/* Component tree 
------------------
                App
      /          |             \
FriendsList   AddFriend     SplitBill
      |          
    Friend       
*/
