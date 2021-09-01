// @ts-ignore
import MemoryStats from "memory-stats";
import LazyDOM from "../src";

const stats = new MemoryStats();
stats.domElement.style.position = "fixed";
stats.domElement.style.right = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);
requestAnimationFrame(function rAFloop() {
  stats.update();
  requestAnimationFrame(rAFloop);
});

// function getRandomColor() {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// const __main__ = () => {
//   const { createElement } = new LazyDOM();
//   const p = createElement("p", {}, [
//     createElement("h1", {}, ["Hello, World!"]),
//     createElement("p", { class: "wow" }, ["This is just so... WOW!"]),
//     createElement("p", { class: "wow2" }, ["Wow what happened! #2"]),
//     createElement(
//       "p",
//       {
//         class: "wow2",
//         onDblclick: (e: Event) => {
//           // @ts-ignore
//           e.target.style.backgroundColor = getRandomColor();
//         },
//       },
//       [
//         "Wow what happened! #2 - This should be a cache hit! Inspect attributes.",
//       ]
//     ),
//     createElement(
//       "p",
//       {
//         class: "wow3",
//         onClick: (e: Event) => {
//           // @ts-ignore
//           e.target.style.backgroundColor = getRandomColor();
//         },
//       },
//       ["This is the least surprising message..."]
//     ),
//   ]);
// };

const MAX_SIZE = 100_000;

const lazyDOMSuite = () => {
  console.time("lazy");
  console.warn("Running LazyDOM Suite.");
  const instance = new LazyDOM();
  const list = [];
  let n = 0;
  while (true) {
    n++;
    list.push(instance.createElement("div", {}, []));
    if (n === MAX_SIZE) {
      console.timeEnd("lazy");
      console.log("total mem: " + console.memory.usedJSHeapSize.toPrecision(4));
      break;
    }
  }
};

const regularDOMSuite = () => {
  console.time("reg");
  console.warn("Running Regular DOM Suite.");
  const list = [];
  let n = 0;
  while (true) {
    n++;
    list.push(document.createElement("div"));
    if (n === MAX_SIZE) {
      console.timeEnd("reg");
      console.log("total mem: " + console.memory.usedJSHeapSize.toPrecision(4));
      break;
    }
  }
};

setTimeout(() => {
  lazyDOMSuite();
}, 1000);
setTimeout(() => regularDOMSuite(), 5000);
// = { createElement: console.log };
// <p x="y">Hello, World! <span>wow</span></p>
