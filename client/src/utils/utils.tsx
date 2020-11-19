/*
You’ll probably end up with miscellaneous utility functions – 
error handlers, formatters, and the like. I usually put them in a file inside utils so I can access them easily.
*/

type Collection = { [key: string]: unknown }[];

export function groupBy(collection: Collection, prop: string) {
  const result: { [key: string]: object[] } = {};

  collection.forEach((obj) => {
    let newProp = String([obj[prop]]);

    if (!(newProp in result)) result[newProp] = [];
    result[newProp].push(obj);
  });
  return result;
}
