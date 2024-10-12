import {easter} from 'date-easter';
import { paddingZero } from '../utils.js';

export function getGoodFridayDate(year: number) {
  const goodFriday = new Date(getEasterDate(year));
  goodFriday.setDate(goodFriday.getDate() - 2);
  return `${paddingZero(goodFriday.getDay())}/${paddingZero(goodFriday.getMonth() + 1)}`;
}

export function getCarnivalDate(year: number) {
  const carnival = new Date(getEasterDate(year));
  carnival.setDate(carnival.getDate() - 47);
  return `${paddingZero(carnival.getDay())}/${paddingZero(carnival.getMonth() + 1)}`;
}

export function getCorpusChristiDate(year: number) {
  const corpusChristi = new Date(getEasterDate(year));
  corpusChristi.setDate(corpusChristi.getDate() + 60);
  return `${paddingZero(corpusChristi.getDay())}/${paddingZero(corpusChristi.getMonth() + 1)}`;
}

function getEasterDate(year: number) {
  const {month, day} = easter(year);
  return new Date(year, month - 1, day);
}