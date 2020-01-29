var rulesDragon = [{
    "left": "X",
    "right": "X+YF+"
},
{
    "left": "Y",
    "right": "-FX-Y"
}];

var rulesDragon2 = [{
    "left": "Y",
    "right": "Y+XF+"
},
{
    "left": "X",
    "right": "-FY-X"
}];

let clonedRulesDragon = JSON.parse(JSON.stringify(rulesDragon))
let newstart = preprocessRules("FX", clonedRulesDragon);
console.log("FX", rulesDragon);
console.log(newstart, clonedRulesDragon);

let clonedRulesDragon2 = JSON.parse(JSON.stringify(rulesDragon2))
let newstart2 = preprocessRules("FY", clonedRulesDragon2);
console.log("FY", rulesDragon2);
console.log(newstart2, clonedRulesDragon2);

function preprocessRules(start, rulez) {
    let to = 'a';
    let coada = [];
    let used = new Set();
    for (let i = 0; i < start.length; i++) {
        if ('A' <= start[i] && start[i] <= 'Z') {
            if (!used.has(start[i])) {
                coada.push(start[i]);
                used.add(start[i]);
            }

            while (coada.length > 0) {
                let from = coada.pop();
                for (let j = 0; j < rulez.length; j++) {
                    if (rulez[j].left == from) {
                        rulez[j].left = to;
                        for (let k = 0; k < rulez[j].right.length; k++) {
                            if ('A' <= rulez[j].right[k] && rulez[j].right[k] <= 'Z') {
                                if (!used.has(rulez[j].right[k])) {
                                    coada.push(rulez[j].right[k]);
                                    used.add(rulez[j].right[k]);
                                }
                            }

                        }
                    }
                    if (from != 'F') {
                        rulez[j].right = rulez[j].right.replace(from, to);
                        start = start.replace(from, to);
                    }
                }
                to = String.fromCharCode(to.charCodeAt() + 1);
                if (to == 'f') String.fromCharCode(to.charCodeAt() + 1);
            }
        }
    }
    rulez.sort(function (a, b) {
        if (a.left < b.left) return -1;
        if (b.left < a.left) return 1;
        return 0;
    })

    start = start.toUpperCase();
    for (let i = 0; i < rulez.length; i++) {
        rulez[i].left = rulez[i].left.toUpperCase();
        rulez[i].right = rulez[i].right.toUpperCase();
    }

    return start;
}
