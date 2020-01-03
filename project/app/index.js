(function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#41A4E6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let mountain = new Path2D();
  mountain.moveTo(0, canvas.height);
  mountain.lineTo(100, 100);
  mountain.lineTo(200, canvas.height);
  mountain.closePath();

  ctx.fillStyle = "black";
  ctx.fill(mountain);

  let image = new Image();
  image.src = canvas.toDataURL("image/png");

  console.log(canvas.toDataURL());

  let link = document.createElement("a");

  link.setAttribute("href", canvas.toDataURL());
  link.setAttribute("download", "test.png");
  link.click();
})();
