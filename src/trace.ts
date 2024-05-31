type Replacer = (this: any, key: string, value: any) => any;

export default function stringify(
  obj: any,
  replacer?: Replacer | null,
  space?: string | number,
  cycleReplacer?: Replacer | null,
) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), space);
}

export function serializer(
  replacer?: Replacer | null,
  cycleReplacer?: Replacer | null,
) {
  const stack: any[] = [], keys: any[] = [];

  if (cycleReplacer == null) {
    cycleReplacer = function (key, value) {
      if (stack[0] === value) return "[Circular ~]";
      return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") +
        "]";
    };
  }

  return function (this: any, key: any, value: any) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
    } else stack.push(value);

    return replacer == null ? value : replacer.call(this, key, value);
  };
}
