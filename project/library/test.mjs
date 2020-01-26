import FractalBuilder from "./builder.mjs";

(async () => {
  const FractalBuilderService = new FractalBuilder({
    email: "razvan.gabriel.apostu@gmail.com",
    token: "V5CBB8W-C1GM3KS-PFEB748-MXW95JW"
  });

  const Client = await FractalBuilderService.who();
  console.log("Client", Client);

  const DragonFractal = await FractalBuilderService.build({
    height: 800,
    width: 800,
    iterations: 10,
    start: {
      symbol: "X",
      x: 400,
      y: 800
    },
    rules: [
      {
        left: "X",
        right: "X+YF+"
      },
      {
        left: "Y",
        right: "-FX-Y"
      }
    ],
    angle: 25
  });

  console.log(DragonFractal);
})();
