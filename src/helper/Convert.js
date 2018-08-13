/**
 * Created by hautruong on 8/8/18.
 */
import {isEmpty, isUndefined, toString} from 'lodash';
const newPrefix = {
  '0162': '032',
  '0163': '033',
  '0164': '034',
  '0165': '035',
  '0166': '036',
  '0167': '037',
  '0168': '038',
  '0169': '039',
  '0120': '070',
  '0121': '079',
  '0122': '077',
  '0126': '076',
  '0128': '078',
  '0123': '083',
  '0124': '084',
  '0125': '085',
  '0127': '081',
  '0129': '082',
  '0186': '056',
  '0188': '058',
  '0199': '059',
};

export function convertToNewPhone(oldPhone) {
  oldPhone = toString(oldPhone);
  if (isEmpty(oldPhone) || isUndefined(oldPhone)) {
    return '';
  }
  oldPhone = oldPhone.replace(/^[+840]+/, 0).replace(/^[+84]+/, '0');
  if (oldPhone.length < 11) {
    return oldPhone;
  }
  let _prefix = oldPhone.slice(0, 4);
  let _newPrefix = newPrefix[_prefix] || '';

  if (isEmpty(_newPrefix) || typeof _newPrefix === 'undefined' || null === _newPrefix || '' === _newPrefix) {
    return oldPhone;
  }
  return `${_newPrefix}${oldPhone.substring(4)}`;
}