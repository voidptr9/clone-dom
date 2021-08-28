# LazyDOM

**LazyDOM** is a library that wraps `document.createElement()` with checks to ensure identical elements are created **precisely once**.

## Motivation

DOM element creation is a straightforward process. The browser calls the underlying APIs to instantiate a representation of a node. When said node is appended to a page, the painting process begins.

Sometimes, creating thousands of nodes can get very tricky and affect the memory complexity of your web application. This is very much notable in huge apps where massive tables or shared components are used.

Luckily, with the `node.cloneNode()` method on elements, we can effectively use the shared attributes and define a `Record<SerializedProps, Element>` _relationship_ between any arbitrary nodes to ensure that, say, _X_ only yields _Y_ when it satisfies a single condition, **shared serializable props**.

This means LazyDOM can effectively reduce the memory overhead of creating 10,000 similar nodes to, say, _N_, which depends on the **rate of identity matches** between nodes. The more the `<td />` elements with the attribute `class="cell center"`, the more the matches, hence more cloning over creation.

This is a sample benchmark demonstrating the performance of `cloneNode()` (±28.1 ops/sec) over `createElement()` (±18.7 ops/sec):

<img align="center" src="https://github.com/voidptr9/lazy-dom/blob/master/res/clone-vs-create.png?raw=true"></img>

**User agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0

**Browser/OS:** Firefox 91 on Windows

The biggest disadvantage is the register could be overpopulated with non-weak in-memory JavaScript objects. One advantage is LazyDOM does not deep copy children and only retains single element info. Additionally, only string props are checked against, meaning, event handlers will **always** be re-attached synchronously since such info is typically lost in the cloning process.

Finally, for elements without any attributes (checked via `NamedNodeMap.prototype.length`), a `__no_attr__` check is used. So every `<p />` node without attributes hits said check and gets cloned immediately, children and event handlers attached, then returned.

## What LazyDOM is not

- LazyDOM is not a mega-multi-purpose swiss-army-knife. It primarily handles element creation.
- Like regular DOM operations, `LazyDOM.createElement()` is not web worker-friendly.
- LazyDOM has nothing to do with ReactDOM.
- Absolutely no diffing. Out of the scope.

## License

MIT License. [Saddam M](https://github.com/voidptr9/).
