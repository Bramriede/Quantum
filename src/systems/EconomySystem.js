// Beheert de Voorraad (currency). Uitgeven kan alleen tijdens de pauzefase
// (zie PLAN.md golf-cyclus) — die regel wordt afgedwongen door BuildSystem,
// niet hier.
export default class EconomySystem {
  constructor(scene, startAmount) {
    this.scene = scene;
    this.amount = startAmount;
    this._emit();
  }

  canAfford(cost) { return this.amount >= cost; }

  spend(cost) {
    if (!this.canAfford(cost)) return false;
    this.amount -= cost;
    this._emit();
    return true;
  }

  add(amount) {
    this.amount += amount;
    this._emit();
  }

  _emit() {
    this.scene.events.emit('supplies-changed', this.amount);
  }
}
