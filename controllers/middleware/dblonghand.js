function getDatabseLongHand(shorthand) {
  switch (shorthand) {
    case "digio":
      return "digitalOceanKey";
    case "aws":
      return "awsKey";
    case "linode":
      return "linodeKey";
    case "vultr":
      return "vultrKey";
    case "google":
      return "googleKey";
    default:
      return "fucku";
  }
}

module.exports = getDatabseLongHand;
