import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseCircleFill } from 'react-icons/ri';

const Modal = ({ children, open, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {open === true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: '.3' } }}
          exit={{ opacity: 0 }}
          className="modal"
        >
          <motion.div
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: '1',
            }}
            className="modal-content"
          >
            <div className="relative">
              <span
                className="absolute top-1 right-1 text-2xl cursor-pointer text-gray-500"
                onClick={() => {
                  onClose();
                }}
              >
                <RiCloseCircleFill />
              </span>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
