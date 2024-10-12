import { paddingZero } from "utils.js";
import {
  getCarnivalDate,
  getCorpusChristiDate,
  getGoodFridayDate,
} from "./specialHolidays.js";

const getHolidays = (year: number) => [
  {
    date: "01/01",
    name: "Confraternização Universal",
    type: "Mundial",
  },
  {
    date: "02/02",
    name: "Nossa Senhora dos Navegantes",
    type: "Municipal",
  },
  {
    date: getCarnivalDate(year),
    name: "Sexta-Feira Santa",
    type: "Nacional",
  },
  {
    date: getGoodFridayDate(year),
    name: "Sexta-Feira Santa",
    type: "Nacional",
  },
  {
    date: "21/04",
    name: "Tiradentes",
    type: "Nacional",
  },
  {
    date: "01/05",
    name: "Dia do Trabalho",
    type: "Nacional",
  },
  {
    date: getCorpusChristiDate(year),
    name: "Sexta-Feira Santa",
    type: "Nacional",
  },
  {
    date: "07/09",
    name: "Independência do Brasil",
    type: "Nacional",
  },
  {
    date: "12/10",
    name: "Nossa Senhora Aparecida (Padroeira do Brasil)",
    type: "Nacional",
  },
  {
    date: "20/09",
    name: "Revolução Farroupilha",
    type: "Estadual",
  },
  {
    date: "02/11",
    name: "Finados",
    type: "Nacional",
  },
  {
    date: "15/11",
    name: "Proclamação da República",
    type: "Nacional",
  },
  {
    date: "20/11",
    name: "Dia da Consciência Negra",
    type: "Nacional",
  },
  {
    date: "25/12",
    name: "Natal",
    type: "Mundial",
  },
];

export function isHoliday(day: number, month: number, year: number) {
  const date = `${paddingZero(day)}/${paddingZero(month)}`;
  return getHolidays(year).some((holiday) => holiday.date == date);
}
