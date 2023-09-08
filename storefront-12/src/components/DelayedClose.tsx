import React, { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  delayedClose?: number;
};

const DelayedClose = ({ children, delayedClose = 500 }: Props) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, delayedClose);
    return () => clearTimeout(timer);
  }, [delayedClose]);

  return isShown ? null : children;
};

export default DelayedClose;