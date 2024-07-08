import dayjs from 'dayjs';

const formatDate = (d:any) => {
  return dayjs(d).format('YYYY/MM/DD HH:mm:ss');
};

export const Common = {formatDate}