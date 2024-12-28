import { u as updated, s as stores } from "./client.js";
({
  get current() {
    return updated.current;
  },
  check: stores.updated.check
});
