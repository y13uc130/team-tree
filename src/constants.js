// constants

export const brokers = [
  {
    name: "Zerodha",
    img: "/assets/images/zerodha.png",
  },
  {
    name: "Upstox",
    img: "/assets/images/upstox.png",
  },
  {
    name: "ICICI",
    img: "/assets/images/icici.png",
  },
  {
    name: "AngelOne",
    img: "/assets/images/angelOne.png",
  },
];

export const ORDER_TYPES = ["regular", "cover", "amo"];

export const TRADE_FORM_INPUT_FIELDS = [
  {
    title: "Quantity",
    id: "quantity",
    type: "number",
  },
  {
    title: "Price",
    id: "price",
    type: "number",
  },
  {
    title: "Trigger Price",
    id: "trigger",
    type: "number",
  },
  {
    title: "Target Price",
    id: "target",
    type: "number",
  },
  {
    title: "Stop Loss",
    id: "stop",
    type: "number",
  },
  {
    title: "Trailing SL",
    id: "trailing",
    type: "number",
  },
];
