const user = {
  username: "Hexa",
  email: "hexa@gmail.com",
  password: "7418529630",
};

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 10.99,
    rating: 4.2,
    category: "Classic Literature",
    description: "A portrait of the Jazz Age in all of its decadence and excess.",
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 8.5,
    rating: 4.7,
    category: "Dystopian",
    description: "A chilling prophecy about the future.",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 32.0,
    rating: 4.8,
    category: "Programming",
    description: "A Handbook of Agile Software Craftsmanship.",
  },
];

const orders = [];

module.exports = {
  user,
  books,
  orders,
};
