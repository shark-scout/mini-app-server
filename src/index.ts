interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}! Your email is ${user.email}`;
}

const sampleUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
};

console.log(greetUser(sampleUser));
