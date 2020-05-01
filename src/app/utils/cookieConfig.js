const dateToExpire = new Date();
const numberOfDaysToAdd = 31;
dateToExpire.setDate(dateToExpire.getDate() + numberOfDaysToAdd);

const cookieConfig = {
  expires: dateToExpire,
  httpOnly: true,
  signed: true,
  sameSite: false,
  credentials: 'include',
};

export default cookieConfig;
