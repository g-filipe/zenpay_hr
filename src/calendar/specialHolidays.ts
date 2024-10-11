import {easter} from 'date-easter';
import { paddingZero } from './holiday.js';

export function getGoodFridayDate() {
  const goodFriday = new Date(getEasterDate());
  goodFriday.setDate(goodFriday.getDate() - 2);
  return `${paddingZero(goodFriday.getDay())}/${paddingZero(goodFriday.getMonth() + 1)}`;
}

export function getCarnivalDate() {
  const carnival = new Date(getEasterDate());
  carnival.setDate(carnival.getDate() - 47);
  return `${paddingZero(carnival.getDay())}/${paddingZero(carnival.getMonth() + 1)}`;
}

export function getCorpusChristiDate() {
  const corpusChristi = new Date(getEasterDate());
  corpusChristi.setDate(corpusChristi.getDate() + 60);
  return `${paddingZero(corpusChristi.getDay())}/${paddingZero(corpusChristi.getMonth() + 1)}`;
}

function getEasterDate() {
  const year = new Date().getFullYear();
  const {month, day} = easter(year);
  return new Date(year, month - 1, day);
}

