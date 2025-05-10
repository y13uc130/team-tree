import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInstruments,
  normalizeByTradingSymbol,
} from "../../store/instruments/instrumentsSlice";
import { setShowTradeModal } from "../../store/trade/tradeSlice";

export const Instrument = ({ instrument, hoveredInstrument }) => {
  const { tradingsymbol, dayChange, value } = instrument;

  return (
    <div
      className={classnames(
        "instrument-container",
        hoveredInstrument === tradingsymbol && "expand-instrument"
      )}
    >
      <div
        className={classnames(
          "name",
          dayChange.percentage > 0 ? "green" : "red"
        )}
      >
        {tradingsymbol}
      </div>
      <div className="tradeValues">
        <div className="daychgv">{dayChange.value}</div>
        <div
          style={{
            "--border-color":
              dayChange.percentage > 0
                ? "rgb(30, 183, 30)"
                : "rgba(223, 43, 43, 0.975)",
            "--transform": dayChange.percentage > 0 ? 180 : 0,
          }}
          className="daychgp"
        >
          <div>{Math.abs(dayChange.percentage)}%</div>
        </div>
        <div
          className={classnames(
            "value",
            dayChange.percentage > 0 ? "green" : "red"
          )}
        >
          {value}
        </div>
      </div>
      <div className="action-buttons-overlay">
        <div className="buy-sell">
          <button
            data-btn-id="buy"
            data-symbol={instrument.tradingsymbol}
            className="buy"
          >
            B
          </button>
          <button
            data-btn-id="sell"
            data-symbol={instrument.tradingsymbol}
            className="sell"
          >
            S
          </button>
        </div>
      </div>
    </div>
  );
};

const Instruments = ({ onRefUpdate, hoveredInstrument }) => {
  const dispatch = useDispatch();

  const {
    instruments = [],
    loading,
    error,
  } = useSelector((state) => state.instruments);
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        onRefUpdate(index, rect, instruments[index]?.tradingsymbol);
      }
    });
  });

  useEffect(() => {
    dispatch(fetchInstruments());
  }, []);

  const handleBuySell = (event) => {
    event.stopPropagation();
    const btn = event.target.closest("button");
    if (!btn) return;
    const btnId = btn.dataset.btnId;
    const symbol = btn.dataset.symbol;
    const info = normalizeByTradingSymbol(instruments)?.[symbol];
    dispatch(
      setShowTradeModal({ active: true, data: { symbol, info, btnId } })
    );
  };

  if (!instruments?.length || loading || error) return null;
  return (
    <div onClick={handleBuySell} className="instruments-container">
      {instruments?.map((instrument, instrumentIndex) => {
        return (
          <div
            key={instrumentIndex}
            ref={(el) => (refs.current[instrumentIndex] = el)}
            style={{
              backgroundColor:
                hoveredInstrument === instrument?.tradingsymbol
                  ? "#f0f0f0"
                  : "#fff",
            }}
          >
            <Instrument
              key={instrumentIndex}
              instrument={instrument}
              hoveredInstrument={hoveredInstrument}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Instruments;
