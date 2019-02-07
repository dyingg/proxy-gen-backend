const ProviderStratergy = require("./handle.js");

const Vultr = new ProviderStratergy(
  "vultr",
  "26N4HF4DSB2QUFFZ7TNQQWTXCTHIJYULZTJQ",
  "5c16c72eefdb828134945ddc"
);

Vultr.checkKey();
