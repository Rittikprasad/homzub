import React, { FC, useEffect } from "react";
import Popup from "reactjs-popup";
import { PopupActions, PopupProps } from "reactjs-popup/dist/types";
import "reactjs-popup/dist/index.css";
import "@homzhub/web/src/components/atoms/Popover/popoverStyle.scss";

interface IProps {
  forwardedRef?: React.Ref<PopupActions>;
  content: React.ReactNode | React.ReactElement;
  children?: JSX.Element;
  popupProps: PopupProps;
}

/**
 * this component can be used to create any dropdown menus or modals
 */
const Popover: FC<IProps> = (props: IProps) => {
  const { content, children, popupProps, forwardedRef } = props;
  useEffect(() => {
    if (popupProps.modal && popupProps.open) {
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.height = "inherit";
      document.body.style.overflow = "inherit";
    }
  }, [popupProps.open]);
  return (
    <Popup
      ref={forwardedRef}
      trigger={<div>{children && children}</div>}
      {...popupProps}
      lockScroll
    >
      {content}
    </Popup>
  );
};

export default Popover;
