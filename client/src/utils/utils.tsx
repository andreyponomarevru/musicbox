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

export function toBitrate(num: number) {
  return `${Math.round(num / 1000)} kbps`;
}

export function toHoursMinSec(seconds: number) {
  const hms = new Date(seconds * 1000).toISOString().substr(11, 8);
  return hms;
}

export function loadErrorHandler() {}
