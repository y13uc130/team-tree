import React, { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./styles.scss";
import classnames from "classnames";
import { useOnClickOutside } from "../../hooks/useClickOutside";

const ModalContainer = ({
  children,
  containerClass,
  modaleContentClass,
  onClose,
  showClose = true,
}) => {
  const modalRef = useRef(null);
  useOnClickOutside({
    refs: [modalRef],
    handler: onClose,
    enabled: true,
    detectEscape: true,
  });
  return (
    <div className={classnames("modal-container", containerClass)}>
      <div
        ref={modalRef}
        className={classnames("modal-content", modaleContentClass)}
      >
        {showClose ? (
          <div onClick={onClose} className="close-button">
            <CloseIcon />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
