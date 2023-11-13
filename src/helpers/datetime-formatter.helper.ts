export const formatDateTime = (date: Date) => {
  return `${date?.getHours()}:${date?.getMinutes()}:${date?.getSeconds()} ${date?.getDate()}/${
    date?.getMonth() + 1
  }/${date?.getFullYear()}`;
};
