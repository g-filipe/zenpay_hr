import { getCarnivalDate, getCorpusChristiDate, getGoodFridayDate } from "./specialHolidays.js";

const getHolidays = () => [
  {
    date: "01/01",
    name: "Confraternização Universal",
    type: "Mundial"
  },
  {
    date: "02/02",
    name: "Nossa Senhora dos Navegantes",
    type: "Municipal"
  },
  {
    date: getCarnivalDate(),
    name: "Sexta-Feira Santa",
    type: "Nacional"
  },
  {
    date: getGoodFridayDate(),
    name: "Sexta-Feira Santa",
    type: "Nacional"
  },
  {
    date: "21/04",
    name: "Tiradentes",
    type: "Nacional"
  },
  {
    date: "01/05",
    name: "Dia do Trabalho",
    type: "Nacional"
  },
  {
    date: getCorpusChristiDate(),
    name: "Sexta-Feira Santa",
    type: "Nacional"
  },
  {
    date: "07/09",
    name: "Independência do Brasil",
    type: "Nacional"
  },
  {
    date: "12/10",
    name: "Nossa Senhora Aparecida (Padroeira do Brasil)",
    type: "Nacional"
  },
  {
    date: "20/09",
    name: "Revolução Farroupilha",
    type: "Estadual"
  },
  {
    date: "02/11",
    name: "Finados",
    type: "Nacional"
  },
  {
    date: "15/11",
    name: "Proclamação da República",
    type: "Nacional"
  },
  {
    date: "20/11",
    name: "Dia da Consciência Negra",
    type: "Nacional"
  },
  {
    date: "25/12",
    name: "Natal",
    type: "Mundial"
  }
];

export function isHoliday(day : number, month : number) {
  const date = `${paddingZero(day)}/${month}`
  return getHolidays().some((holiday) => holiday.date == date)
}

export function paddingZero(date : number) {
  return String(date).padStart(2, '0')
}
// conjunto de dis

// OUTUBRO
// 31 DIAS
// 23 UTEIS
// 8 FDS 

// JORNADA 6H = DIAS UTEIS VA/VR $ X DIAS UTEIS
// JORNADA 8H = (6X1) -27 DIAS -> 23 UTEIS (8H) $2 + 4 DIAS FDS $1 4DIASFDS FERIADO? $2
