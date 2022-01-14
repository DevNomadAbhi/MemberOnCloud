
 

export const fakeServer = (qty,arr) =>
  new Promise((resolve, reject) => {
    let newArr;
    const lastItemIndex = arr.indexOf(lastItem);
    if (lastItemIndex === arr.length - 1) return resolve('done');

    if (!lastItem) {
      newArr = [...arr].slice(0, qty);
      lastItem = [...newArr].pop();
    } else {
      const newIndex = arr.indexOf(lastItem) + 1;
      newArr = [...arr].slice(newIndex, qty + newIndex);
      lastItem = [...newArr].pop();
    }
    setTimeout(() => {
      resolve(newArr);
    }, 1000);
  });