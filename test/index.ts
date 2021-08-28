import LazyDOM from "../src";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const instance = new LazyDOM();
const p = instance.createElement("p", {}, [
  instance.createElement("h1", {}, ["Hello, World!"]),
  instance.createElement("p", { class: "wow" }, ["This is just so... WOW!"]),
  instance.createElement("p", { class: "wow2" }, ["Wow what happened! #2"]),
  instance.createElement(
    "p",
    {
      class: "wow2",
      onDblclick: (e: Event) => {
        // @ts-ignore
        e.target.style.backgroundColor = getRandomColor();
      },
    },
    ["Wow what happened! #2 - This should be a cache hit! Inspect attributes."]
  ),
  instance.createElement(
    "p",
    {
      class: "wow3",
      onClick: (e: Event) => {
        // @ts-ignore
        e.target.style.backgroundColor = getRandomColor();
      },
    },
    ["This is the least surprising message..."]
  ),
]);

console.log(p);
document.body.append(p);
