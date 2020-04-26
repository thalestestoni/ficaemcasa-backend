import formatPhone from './formatPhone';

export default function isPhone(phone) {
  const defautlPhone = /^\+?([0-9]{1,3})\)?([0-9]{5,12})$/;

  phone = formatPhone(phone);

  if (phone.match(defautlPhone)) {
    return true;
  }
  return false;
}
