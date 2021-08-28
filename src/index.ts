// Copyright (c) 2021 Saddam M. All rights reserved.
// JSON is used to stringify string properties so deep equality checks are cheap.
const { stringify } = JSON;

class LazyDOM {
  // The register is a key-value relationship for mapping nodes that
  // are identical based on string attributes that are serializable.
  register: any = {};

  static serializeProps(attributes: NamedNodeMap): string {
    if (attributes.length == 0) {
      return "__no_attr__";
    } else {
      let final: Record<string, string> = {};

      for (let i = 0, len = attributes.length; i < len; i++) {
        const attr = attributes[i];
        final[attr.name] = attr.value;
      }

      return stringify(final);
    }
  }

  static appendPropsToElement(element: Element, props: object) {
    for (const prop in props) {
      if (!prop.startsWith("on"))
        // @ts-ignore
        element.setAttribute(prop, props[prop]);
    }
  }

  static appendEventHandlers(element: Element, props: object): Element {
    for (const prop in props) {
      if (prop.startsWith("on")) {
        // @ts-ignore
        element.addEventListener(prop.slice(2).toLowerCase(), props[prop]);
      }
    }

    return element;
  }

  static appendChildren(
    element: Element,
    children: (Element | string)[]
  ): Element {
    element.append(...children);
    return element;
  }

  // @ts-ignore
  createElement(
    nodeName: string,
    props: object = {},
    children: (Element | string)[]
  ) {
    // Step 0: Check if there is a cache hit. Similar patterns are grouped for cloning.
    const stringifiedProps = stringify(props);
    const cachedElement =
      stringifiedProps === stringify({})
        ? (this.register[nodeName] || {})["__no_attr__"]
        : (this.register[nodeName] || {})[stringifiedProps];

    // Step 1: Capture, assuming the current node is found in the register:
    if (nodeName in this.register && cachedElement) {
      this.register[nodeName] = {
        ...this.register[nodeName],
        [LazyDOM.serializeProps(cachedElement.attributes)]: cachedElement,
      };

      // Step 2: Return a clone of the cached element with children and handlers
      // attached (props are inherited from the `stringifiedProps` check).
      return LazyDOM.appendChildren(
        LazyDOM.appendEventHandlers(cachedElement.cloneNode(), props),
        children
      );
    } else {
      // Step 3: Create the instance and populate the register with the initialized info
      // without appending the children - since a childless instance is required for checks.
      const element = document.createElement(nodeName);
      LazyDOM.appendPropsToElement(element, props);
      const serializedProps = LazyDOM.serializeProps(element.attributes);
      this.register[nodeName] = {
        ...this.register[nodeName],
        [serializedProps]: element,
      };
      // Step 4: Append the children and return the raw element with props, children and handlers.
      return LazyDOM.appendEventHandlers(
        LazyDOM.appendChildren(element, children),
        props
      );
    }
  }
}

export default LazyDOM;
