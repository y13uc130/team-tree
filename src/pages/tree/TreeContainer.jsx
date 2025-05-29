import { useState, useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { motion } from 'framer-motion';
import './styles.scss';
import TreeNode from '../../components/treeNode/TreeNode';

const TreeContainer = ({ filteredData, updateEmployees, allEmployees }) => {
  const [nodes, setNodes] = useState(filteredData);
  const draggedNodeId = useRef(null);
  const nodeRefs = useRef({});
  const [lines, setLines] = useState([]);

  const onDragStart = (e, id) => {
    draggedNodeId.current = id;
  };

  const nodesWithPathAndLevel = useMemo(() => {
    const idMap = {};
    nodes.forEach(node => {
      idMap[node.id] = node;
    })

    const getPathAndLevel = (node) => {
      let path = [];
      let current = node;
      if (!current || !current.manager) return { ...node, path: [], level: 0 };
      while (current && current.manager) {
        path.unshift(current.manager);
        current = idMap[current.manager];
      }
      return { path, level: path.length };
    }
    return nodes.map(node => {
      const { path, level } = getPathAndLevel(node);
      return {
        ...node,
        path,
        level
      }
    })
  }, [nodes]);
  const onDrop = (e, targetId) => {
    const targetNode = nodesWithPathAndLevel.find(node => node.id === targetId);
    if (targetNode.path.includes(draggedNodeId.current)) return;
    if (draggedNodeId.current === targetId) return;
    setNodes((prev) => {
      const newNodes = prev.map((n) => n.id === draggedNodeId.current ? { ...n, manager: targetId } : n
      );
      const newEmployees = allEmployees.map((n) => n.id === draggedNodeId.current ? { ...n, manager: targetId } : n
      );
      requestAnimationFrame(updateLines);
      updateEmployees(newEmployees);
      return newNodes;
    }
    );
  };

  const registerRefs = (id, nodeRef, wrapperRef) => {
    nodeRefs.current[id] = { nodeRef, wrapperRef };
  };

  const updateLines = () => {
    const container = document.getElementById('tree-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const newLines = [];

    nodes.forEach((child) => {
      const parent = nodes.find((p) => p.id === child?.manager);
      if (!parent) return;

      const parentRef = nodeRefs.current[parent.id]?.nodeRef?.current;
      const childRef = nodeRefs.current[child.id]?.nodeRef?.current;

      if (parentRef && childRef) {
        const parentRect = parentRef.getBoundingClientRect();
        const childRect = childRef.getBoundingClientRect();

        const offsetX = -containerRect.left + scrollLeft;
        const offsetY = -containerRect.top + scrollTop;

        const parentBottomX1 = parentRect.left + parentRect.width / 2 + offsetX;
        const parentBottomY1 = parentRect.bottom + offsetY;

        const parentBottomX2 = parentRect.left + parentRect.width / 2 + offsetX;
        const parentBottomY2 = parentRect.bottom + (childRect.top - parentRect.bottom) / 2 + offsetY;

        const childTop1X = childRect.left + childRect.width / 2 + offsetX;
        const childTop1Y = parentRect.bottom + (childRect.top - parentRect.bottom) / 2 + offsetY;

        const childTop2X = childRect.left + childRect.width / 2 + offsetX;
        const childTop2Y = childRect.top + offsetY;

        newLines.push({ x1: parentBottomX1, y1: parentBottomY1, x2: parentBottomX2, y2: parentBottomY2 });
        newLines.push({ x1: parentBottomX2, y1: parentBottomY2, x2: childTop1X, y2: childTop1Y });
        newLines.push({ x1: childTop1X, y1: childTop1Y, x2: childTop2X, y2: childTop2Y });
      }
    });

    setLines(newLines);
  };

  useEffect(() => {
    setNodes(filteredData);
  }, [filteredData]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setTimeout(updateLines, 0);
    });
  }, []);

  useLayoutEffect(() => {
    const updateAfterLayout = () => {
      requestAnimationFrame(() => {
        updateLines();
      });
    };

    const observer = new MutationObserver(() => updateAfterLayout());
    const container = document.getElementById('tree-container');
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    container.addEventListener('scroll', updateAfterLayout, true);
    window.addEventListener('resize', updateAfterLayout);

    updateAfterLayout();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', updateAfterLayout, true);
      window.removeEventListener('resize', updateAfterLayout);
    };
  }, [nodes]);

  const renderTree = (manager) => {
    return nodes
      .filter((n) => n.manager === manager)
      .map((n) => (
        <TreeNode
          key={n.id}
          node={n}
          onDragStart={onDragStart}
          onDrop={onDrop}
          registerRefs={registerRefs}
        >
          {renderTree(n.id)}
        </TreeNode>
      ));
  };

  return (
    <div className='tree-wrapper-container'>
      <div id="tree-container">
        <svg className='svg-lines'
        >
          {lines.map((line, idx) => {
            const isReady = line.x1 !== line.x2 || line.y1 !== line.y2;
            return isReady ? (
              <motion.line
                key={idx}
                initial={{ x1: line.x1, y1: line.y1, x2: line.x1, y2: line.y1 }}
                animate={{ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                stroke="black"
                strokeWidth="2"
              />
            ) : null;
          })}
        </svg>
        {renderTree(null)}
      </div>
    </div>
  );
};

export default TreeContainer;
