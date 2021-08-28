import LazyDOM from "../src";

const instance = new LazyDOM();

const p = instance.createElement("p", {}, [
  "Hello, World!",
  instance.createElement("p", { class: "wow" }, ["This is just so... WOW!"]),
  instance.createElement("p", { class: "wow2" }, ["Wow what happened! #2"]),
  instance.createElement("p", { class: "wow2" }, ["Wow what happened! #2"]),
  instance.createElement("p", { class: "wow3" }, [
    "This is the least surprising message...",
  ]),
]);

console.log(p);
