import React, { VoidFunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./PaginationControls.scss";
import classnames from "classnames";

import PaginationButton from "@/components/ui/pagination/PaginationButton/PaginationButton"

const MAX_SLOTS = 7;

export interface Props extends BaseProps {
  numPages: number;
  initPage?: number; // 0-indexed
  onPageChange?: (newPage: number) => unknown;
};

const PaginationControls: VoidFunctionComponent<Props> = (props) => {
  const { numPages, initPage, onPageChange } = props;

  const [page, setPage] = useState(initPage!);

  const renderPageButton = (idx: number) => {
    return (
      <PaginationButton
        page={idx}
        onClick={() => {
          if (onPageChange)
            onPageChange(idx);
        }}
      />
    )
  }

  const renderPaginationList = () => {
    // Render all page buttons
    if (numPages <= MAX_SLOTS) {
      return Array(numPages).fill(0).map((_, idx) => renderPageButton(idx));
    }

    // TODO: complete
    return Array(numPages).fill(0).map((_, idx) => renderPageButton(idx));
  }

  return (
    <div 
      className={classnames("PaginationControls", props.className)}
      style={props.style}
      id={props.id}
    >
      {renderPaginationList()}
    </div>
  );
};

PaginationControls.defaultProps = {
  initPage: 0
} as Partial<Props>;

export default PaginationControls;