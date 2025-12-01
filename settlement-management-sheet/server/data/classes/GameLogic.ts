export default class GameLogic {
  constructor(
    name,
    attrition = [],
    retention = [],
    modifiers = [],
    weather = []
  ) {
    (this.name = name),
      (this.attrition = attrition),
      (this.retention = retention),
      (this.modifiers = modifiers),
      (this.morale = {
        Neutral: 1,
        Fear: 0,
        Inspired: 0,
        Desperate: 0,
        Hopeful: 0,
        Complacent: 0,
        Riotous: 0,
      }),
      (this.weather = weather);
  }
}
