const users = [];

const addUser = ({ id, email, room}) => {
  email = email.trim().toLowerCase()
 console.log(email);
  const existingUser = users.find((user) =>user.email === email);
console.log(existingUser)
  if(!email ) return { error: 'Username   are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, email ,room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

 

module.exports = { addUser, removeUser, getUser};
