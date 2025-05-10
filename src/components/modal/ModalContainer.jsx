import { AnimatePresence, motion } from "motion/react";
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
  isOpen = false,
}) => {
  const modalRef = useRef(null);
  useOnClickOutside({
    refs: [modalRef],
    handler: onClose,
    enabled: true,
    detectEscape: true,
  });
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={classnames("modal-container", containerClass)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ModalContainer;
