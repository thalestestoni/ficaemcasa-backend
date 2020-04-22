export default function formatPhone(phone) {
  return phone
    .replace('(', '')
    .replace(')', '')
    .replace('-', '')
    .split(' ')
    .join('');
}
