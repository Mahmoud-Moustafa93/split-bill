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
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((prevFriends) => [...prevFriends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((curFriend) =>
      friend.id === curFriend?.id ? null : friend
    );

    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friendsArr) =>
      friendsArr.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button
          onClick={() => {
            setShowAddFriend(!showAddFriend);
          }}
        >
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelection={onSelection}
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ onSelection, friend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;

  return (
    <li className={isSelected ? "selected" : ""} key={friend.id}>
      <img src={friend.image} alt={friend.fname} />
      <h3>{friend.fname}</h3>

      {friend.balance > 0 && (
        <p className="green">
          {friend.fname} owes you {friend.balance}€
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.fname} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.fname} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
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
        maxLength="30"
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

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(whoIsPaying === "user" ? friendExpense : -userExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.fname}</h2>
      <label>💰 Bill value</label>
      <input
        type="number"
        min="0"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        required
      />

      <label>🧍‍♀️ Your expense</label>
      <input
        type="number"
        min="0"
        max={bill}
        value={userExpense}
        onChange={(e) => setUserExpense(Number(e.target.value))}
        required
      />

      <label>👫 {selectedFriend.fname}'s expense</label>
      <input type="number" min="0" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.fname}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
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
