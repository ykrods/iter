/**
 * Copied from svelte-mui. original license is below
 *
 * Copyright (c) 2019-2020 vikignt
 * Licensed under the MIT License (MIT), see
 * https://github.com/vikignt/svelte-mui
 */
// Thanks to @AlexxNB

import { bubble, listen } from "svelte/internal";

export function getEventsAction(component) {
  return (node) => {
    const events = Object.keys(component.$$.callbacks);
    const listeners = [];

    events.forEach((event) =>
      listeners.push(listen(node, event, (e) => bubble(component, e)))
    );

    return {
      destroy: () => {
        listeners.forEach((listener) => listener());
      },
    };
  };
}
