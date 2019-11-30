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

lsystem(6, "X", rulesPlant, 400, canvas.height, 25);

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
    var len = 256;
    var degrees = 270;
    var states = [];

    console.log(S);
    for (var i = 0; i < iterations; ++i) {
        S = generate(S, R);
        console.log(S);
        len /= 2;
    }
    ctx.moveTo(xs, ys);

    for (var s of S) {
        if (s == "F") {
            xf = xs + len * Math.cos(degrees * Math.PI / 180);
            yf = ys + len * Math.sin(degrees * Math.PI / 180);
            ctx.lineTo(xf, yf);
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

