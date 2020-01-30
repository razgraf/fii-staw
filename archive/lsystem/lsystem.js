var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var rulesKoch = [{
    "left": "F",
    "right": "F+F-F-F+F"
}];

var rulesDragon = [{
    "left": "X",
    "right": "X+YF+"
},
{
    "left": "Y",
    "right": "-FX-Y"
}];

var rulesPlant = [{
    "left": "X",
    "right": "F+[[X]-X]-F[-FX]+X"
},
{
    "left": "F",
    "right": "FF"
}];

//lsystem(6, "X", rulesPlant, 400, canvas.height, 25);

function generate(S, R) {
    var new_S = "";
    var found = 0;
    for (var s of S) {
        found = 0;
        for (var i = 0; i < R.length; ++i) {
            if (R[i].left == s) {
                new_S += R[i].right;
                found = 1;
                break;
            }
        }
        if (found == 0) {
            new_S += s;
        }
    }
    return new_S;
}




function lsystem(iterations, S, R, xs, ys, angle) {
    var len = 4096;
    var degrees = 270;
    var states = [];

    
    for (var i = 0; i < iterations; ++i) {
        S = generate(S, R);
        len /= 2;
    }
    console.log(S);
    //ctx.moveTo(xs, ys);

    for (var s of S) {
        if (s == "F") {
            ctx.beginPath()
            ctx.moveTo(xs,ys);
            xf = xs + len * Math.cos(degrees * Math.PI / 180);
            yf = ys + len * Math.sin(degrees * Math.PI / 180);
            ctx.lineTo(xf, yf);
            ctx.strokeStyle = "#0000ff";
            ctx.stroke();
            xs = xf;
            ys = yf;
            ctx.moveTo(xs, ys);
        } else if (s == "+") {
            degrees += angle;
        } else if (s == "-") {
            degrees -= angle;
        } else if (s == "[") {
            states.push({ "xs": xs, "ys": ys, "degrees": degrees });
        } else if (s == "]") {
            state = states.pop();
            xs = state.xs;
            ys = state.ys;
            degrees = state.degrees;
            ctx.moveTo(xs, ys);
        }
    }
}

let states = [];


//mystring = "";

function lsystemrec(iterations, start, rules, state, angle, states, len) {
    for (let s of start) {
        if ('A' <= s && s <= 'Z') {
            let found = 0;
            if(iterations > 0) {
                for (let rule of rules) {
                    if (rule.left == s) {
                        found = 1;
                        lsystemrec(iterations - 1, rule.right, rules, state, angle, states, len);
                        break;
                    }
                }
            } else {
                //mystring += s;
            }
            if(s == 'F' && (found == 0 || iterations == 0)) {
                ctx.beginPath();
                ctx.moveTo(state.x, state.y);
                let xf = state.x + len * Math.cos(state.degrees * Math.PI / 180);
                let yf = state.y + len * Math.sin(state.degrees * Math.PI / 180);
                ctx.lineTo(xf, yf);
                ctx.stroke();
                state.x = xf;
                state.y = yf;
                ctx.moveTo(state.x, state.y);
            }
        } else if (s == "+" ) {
            //mystring += s;
            state.degrees += angle;
        } else if (s == "-") {
            //mystring += s;
            state.degrees -= angle;
        } else if (s == "[") {
            //mystring += s;
            states.push({...state});
        } else if (s == "]") {
            //mystring += s;
            state = states.pop();
            ctx.moveTo(state.x, state.y);
        }
    }   
}

var newRules = [{
    "left": "F",
    "right": "FF+[+F-F-F]-[-F+F+F]"
}];
lsystemrec(2, "F", newRules, {x: 300, y: 600, degrees: 270}, 22.5, [], 5);
