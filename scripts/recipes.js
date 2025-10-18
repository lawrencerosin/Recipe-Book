class Ingredient{
    constructor(amount, unit, name){
        this.amount=amount;
        this.unit=unit;
        this.name=name;
     }
     toString(){
          return `${this.amount} ${this.unit} of ${this.name}`;
      }
}
function AddIngredient(){
    const ingredient=document.getElementById("add-ingredient");
    const UNITS=["Cups", "Tablespoons", "Teaspoons"];
    const amount=document.createElement("input");
    amount.setAttribute("type", "number");
    amount.setAttribute("placeholder", "Amount");
    const unitSelection=document.createElement("select");
    for(let current of UNITS){
        const unitOption=document.createElement("option");
        unitOption.textContent=current;
        unitSelection.appendChild(unitOption);
    }
    const name=document.createElement("input");
    name.setAttribute("placeholder", "Ingredient");

    ingredient.appendChild(amount);
    ingredient.appendChild(unitSelection);
    ingredient.appendChild(name);
    ingredient.innerHTML+="<br>";
    const ok=document.createElement("button");
    ok.textContent="Ok";
    ingredient.appendChild(ok);
    const cancel=document.createElement("button");
    cancel.textContent="Cancel";
    ingredient.appendChild(cancel);
}
