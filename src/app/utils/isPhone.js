import formatPhone from './formatPhone';

export default function isPhone(phone) {
  const defautlPhone = /^\+?([0-9]{2})\)?([0-9]{2})\)?([0-9]{9})$/;

  phone = formatPhone(phone);

  if (phone.match(defautlPhone)) {
    return true;
  }
  return false;
}
