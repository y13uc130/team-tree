import React, { useCallback } from "react";
import classnames from "classnames";
import "./styles.scss";
import { USER_PNL_MAPPING } from "../dashboard/data";
import { formatNumberWithCommas } from "../../utils";
import { HOLDINGS_TABLE_COLUMNS } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { setShowTradeModal } from "../../store/trade/tradeSlice";
import { normalizeByTradingSymbol } from "../../store/instruments/instrumentsSlice";

const Holdings = () => {
  const {
    profile: { userPnL, userHoldings },
  } = useSelector((state) => state.user);
  const { instruments } = useSelector((state) => state.instruments);
  const dispatch = useDispatch();

  const handleBuySellClick = useCallback(
    (trade) => {
      dispatch(
        setShowTradeModal({
          active: true,
          data: {
            info: normalizeByTradingSymbol(instruments)?.[trade.tradingSymbol],
            btnId: "buy",
            symbol: trade.tradingSymbol,
          },
        })
      );
    },
    [instruments]
  );

  if (!Object.keys(userPnL)?.length) return null;

  return (
    <>
      <div className="main-container">
        <h2>Holdings ({userHoldings.length})</h2>
        <div className="pnl-section">
          {Object.keys(userPnL).map((field, fieldIndex) => {
            const content = userPnL[field]?.value
              ? userPnL[field]?.value
              : userPnL[field];
            const [beforeDot, afterDot] = content?.toString()?.split(".");
            if (field !== "dayPnL" && field !== "totalPnL") {
              return (
                <div key={fieldIndex} className="details-section">
                  <div className="title">{USER_PNL_MAPPING[field]}</div>
                  <div className="value">
                    <div>
                      {formatNumberWithCommas(beforeDot)} <sub>.{afterDot}</sub>{" "}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={fieldIndex} className="details-section">
                  <div className="title">{USER_PNL_MAPPING[field]}</div>
                  <div
                    className={classnames(
                      "value",
                      beforeDot > 0 ? "profit" : "loss"
                    )}
                  >
                    <div>
                      {formatNumberWithCommas(beforeDot)} <sub>.{afterDot}</sub>
                    </div>
                    <div
                      className={classnames(
                        "percentage",
                        beforeDot > 0 ? "profit" : "loss"
                      )}
                    >
                      {userPnL[field]?.percentage}%
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="table-container">
          <table className="holdings-table">
            <thead>
              <tr>
                {HOLDINGS_TABLE_COLUMNS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userHoldings.map((item) => (
                <tr
                  onClick={() => handleBuySellClick(item)}
                  key={item.tradingSymbol}
                >
                  <td>{item.tradingSymbol}</td>
                  <td>{item.quantity}</td>
                  <td>{item.avgCost.toFixed(2)}</td>
                  <td>{item.ltp.toFixed(2)}</td>
                  <td>{item.invested.toLocaleString()}</td>
                  <td>{item.currValue.toLocaleString()}</td>
                  <td className={item.pnl < 0 ? "loss" : "profit"}>
                    {item.pnl.toFixed(2)}
                  </td>
                  <td className={item.netChg < 0 ? "loss" : "profit"}>
                    {item.netChg}%
                  </td>
                  <td className={item.dayChg < 0 ? "loss" : "profit"}>
                    {item.dayChg}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="holdings-mobile-wrapper">
        {userHoldings.map((item) => (
          <div
            onClick={() => handleBuySellClick(item)}
            key={item.tradingSymbol}
            className="holding-card"
          >
            <div className="row top-row">
              <div className="left-row">
                <span className="meta">Qty. {item.quantity}</span>
                <span className="dot" />
                <span className="meta">Avg. {item.avgCost.toFixed(2)}</span>
              </div>
              <span className={item.netChg < 0 ? "loss" : "profit"}>
                {item.netChg.toFixed(2)}%
              </span>
            </div>

            <div className="symbol">{item.tradingSymbol}</div>

            <div className="row invested-row">
              <span className="meta">
                Invested {item.invested.toLocaleString()}
              </span>
              <span className={item.pnl < 0 ? "loss" : "profit"}>
                {item.pnl.toFixed(2)}
              </span>
            </div>

            <div className="row ltp-row">
              <span className="meta">
                LTP {item.ltp.toFixed(2)}{" "}
                <span className={item.dayChg < 0 ? "loss" : "profit"}>
                  ({item.dayChg.toFixed(2)}%)
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Holdings;
