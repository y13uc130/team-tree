import React from "react";
import classnames from "classnames";
import "./styles.scss";
import { USER_PNL_MAPPING } from "../dashboard/data";
import { formatNumberWithCommas } from "../../utils";
import { HOLDINGS_TABLE_COLUMNS } from "../../constants";
import { useSelector } from "react-redux";

const Holdings = () => {
  const {
    profile: { userPnL, userHoldings },
  } = useSelector((state) => state.user);

  if (!Object.keys(userPnL)?.length) return null;

  return (
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
              <tr key={item.tradingSymbol}>
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
  );
};

export default Holdings;
