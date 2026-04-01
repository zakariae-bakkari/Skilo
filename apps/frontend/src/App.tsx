import { useEffect, useState } from "react";

function UsersList() {
interface User {
  id: number;
  name: string;
}

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.lastName} {user.firstName}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;