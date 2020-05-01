const dateToExpire = new Date();
const numberOfDaysToAdd = 31;
dateToExpire.setDate(dateToExpire.getDate() + numberOfDaysToAdd);

const cookieConfig = {
  expires: dateToExpire,
  httpOnly: true,
  sameSite: false,
};

export default cookieConfig;
