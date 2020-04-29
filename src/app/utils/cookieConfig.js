const dateToExpire = new Date();
var numberOfDaysToAdd = 31;
dateToExpire.setDate(dateToExpire.getDate() + numberOfDaysToAdd);

const cookieConfig = {
  expires: dateToExpire,
  httpOnly: true,
  signed: true,
  sameSite: false,
};

export default cookieConfig;
