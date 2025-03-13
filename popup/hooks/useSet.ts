// https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-set/use-set.ts

import { useForceUpdate } from "@mantine/hooks";
import { useRef } from "react";

export function useSet<T>(values?: T[]): Set<T> {
  const setRef = useRef(new Set(values));
  const forceUpdate = useForceUpdate();

  setRef.current.add = (...args) => {
    const res = Set.prototype.add.apply(setRef.current, args);
    forceUpdate();

    return res;
  };

  setRef.current.clear = (...args) => {
    Set.prototype.clear.apply(setRef.current, args);
    forceUpdate();
  };

  setRef.current.delete = (...args) => {
    const res = Set.prototype.delete.apply(setRef.current, args);
    forceUpdate();

    return res;
  };

  return setRef.current;
}
