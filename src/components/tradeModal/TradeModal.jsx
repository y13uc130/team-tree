// TODO: MODAL ADD ANIMATION
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./styles.scss";
import ModalContainer from "../modal/ModalContainer";
import {
  ORDER_TYPES,
  RUPEE_SYMBOL,
  TRADE_FORM_INPUT_FIELDS,
} from "../../constants";
import { mapInputValuesWithDefaults } from "../../helpers";
import { formatNumberWithCommas } from "../../utils";

const TradeModal = ({ selectedTrade, onClose }) => {
  const {
    symbol,
    info: { value, dayChange },
    info,
    btnId: tradeType,
  } = selectedTrade;
  const [tradeTypeLocal, setTradeType] = useState(tradeType);
  const [orderType, setOrderType] = useState("regular");
  const { register, handleSubmit, watch } = useForm({
    defaultValues: mapInputValuesWithDefaults(TRADE_FORM_INPUT_FIELDS, info),
  });

  const inputValues = watch();

  useEffect(() => {
    console.log("selectedTrade", selectedTrade);
  }, []);
  const handleBuy = () => {
    setTradeType("buy");
  };
  const handleSell = () => {
    setTradeType("sell");
  };
  const handleOrderTypeSelect = (type) => {
    setOrderType(type);
  };
  const onSubmitClick = (values) => {
    console.log("VALUES", values);
    onClose();
  };
  return (
    <ModalContainer onClose={onClose} containerClass={"trade-modal-container"}>
      <div className="top-section">
        <div className="top-left-section">
          <div className="bar-chart-icon">
            <BarChartIcon />
          </div>
          <div className="trade-name">{symbol}</div>
        </div>
        <div className="top-right-section">
          <div className="value">
            {RUPEE_SYMBOL}
            {formatNumberWithCommas(value)}
          </div>
          <div
            className={classnames(
              "value",
              dayChange?.percentage > 0 ? "green" : "red"
            )}
          >{`${dayChange?.percentage > 0 ? "+" : "-"}${
            dayChange?.value
          } (${Math.abs(dayChange?.percentage)}%)`}</div>
        </div>
      </div>
      <div className="main-section">
        <div className="tab-trade-type-section">
          <div className="tab-section">
            <button
              onClick={handleBuy}
              className={classnames(
                "tab",
                tradeTypeLocal === "buy" ? "buy" : ""
              )}
            >
              BUY
            </button>
            <button
              onClick={handleSell}
              className={classnames(
                "tab",
                tradeTypeLocal === "sell" ? "sell" : ""
              )}
            >
              SELL
            </button>
          </div>
          <div className="order-type-section">
            {ORDER_TYPES.map((orderTab, orderTabIndex) => {
              return (
                <div
                  key={orderTabIndex}
                  onClick={() => handleOrderTypeSelect(orderTab)}
                  className={classnames(
                    "order-tab",
                    orderType === orderTab && "active"
                  )}
                >
                  {orderTab.toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
        <form className="form-section" onSubmit={handleSubmit(onSubmitClick)}>
          <div className="fields-section">
            {TRADE_FORM_INPUT_FIELDS.map((field, fieldIndex) => {
              return (
                <div key={field.id} className="field-container">
                  <div className="title">{field.title}</div>
                  <input
                    type={field.type}
                    {...register(field.id)}
                    step="any"
                    className="input-field"
                  />
                </div>
              );
            })}
          </div>
          <div className="footer-section">
            <div className="margin-section">
              <div className="title">Required Margin</div>
              <div className="content">
                {RUPEE_SYMBOL}{" "}
                {formatNumberWithCommas(
                  inputValues.quantity * inputValues.price
                )}
              </div>
            </div>
            <button
              className={classnames(
                "submit-button",
                tradeTypeLocal === "buy" ? "buy" : "sell"
              )}
            >
              {tradeTypeLocal?.toUpperCase()} {symbol}
            </button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
};

export default TradeModal;
