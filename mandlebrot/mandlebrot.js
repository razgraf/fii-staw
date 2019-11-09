var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

drawMandlebrot();

function drawMandlebrot() {
    maxiterations = 1000;
    interval = 2;
    //maxval = Math.pow(interval, 4);
    maxval = 20;
    c = { "real": 0, "imag": 0 };

    for (x = 0; x < canvas.width; x++) {
        for (y = 0; y < canvas.height; y++) {

            c.real = map(x, 0, canvas.width, -interval, interval);
            c.imag = map(y, 0, canvas.height, -interval, interval);

            z = { "real": c.real, "imag": c.imag };

            for (n = 0; n < maxiterations; n++) {
                newz = {
                    "real": z.real * z.real - z.imag * z.imag,
                    "imag": 2 * z.real * z.imag
                };

                z = {
                    "real": newz.real + c.real,
                    "imag": newz.imag + c.imag
                };

                if (Math.abs(z.real + z.imag) > maxval) break;
            }

            let color = 0;
            if (n < maxiterations) {
                color = map(n, 0, maxiterations, 0, 1);
                color = map(Math.sqrt(color), 0, 1, 0, 255);
            }

            drawPixel(x, y, `rgb(${color}, ${color}, ${color})`);
        }
    }
}

// [A, B] -> [a, b]
function map(val, A, B, a, b) {
    return (val - A) * (b - a) / (B - A) + a;
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}