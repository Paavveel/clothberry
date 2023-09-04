/* eslint-disable */
import React, { useEffect, useRef } from 'react';

import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { ComponentOptionsType as FancyboxOptionsType } from '@fancyapps/ui/types/Fancybox/options';

export const Fancybox = (props: {
  children?: React.ReactNode;
  delegate?: string;
  options?: Partial<FancyboxOptionsType>;
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props?.delegate || '[data-fancybox]';
    const options = props?.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{props?.children}</div>;
};
