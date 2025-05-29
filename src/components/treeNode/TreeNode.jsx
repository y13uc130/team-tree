import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import EmployeeCard from '../employee/EmployeeCard';
import './styles.scss';

const TreeNode = ({
  node,
  children,
  onDragStart,
  onDrop,
  registerRefs,
}) => {
  const nodeRef = useRef();
  const wrapperRef = useRef();
  const [isDragging, setIsDragging] = useState(false);


  useEffect(() => {
    if (registerRefs) {
      registerRefs(node.id, nodeRef, wrapperRef);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className='treenode-wrapper'
    >
      <motion.div
        ref={nodeRef}
        draggable
        onDragStart={(e) => {
          onDragStart(e, node.id);
          setIsDragging(true);
        }}
        onDragEnd={() => setIsDragging(false)}
        onDrop={(e) => {
          onDrop(e, node.id);
          setIsDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        className='employee-node'
        animate={isDragging ? { scale: 1.3, opacity: 0.7, zIndex: 100 } : { scale: 1, opacity: 1, zIndex: 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <EmployeeCard data={node} />
      </motion.div>

      {children?.length > 0 && (
        <div className='children-nodes'
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
