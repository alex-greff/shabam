import React, { VoidFunctionComponent, useState } from "react";
import { BaseProps } from "@/types";
import "./PaginationControls.scss";
import classnames from "classnames";

import PaginationButton from "@/components/ui/pagination/PaginationButton/PaginationButton"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

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
        key={idx}
        selected={idx === page}
        page={idx}
        onClick={() => {
          if (onPageChange)
            onPageChange(idx);
          setPage(idx);
        }}
      />
    )
  };

  const renderEllipses = () => {
    return (<div className="PaginationControls__ellipses"><MoreHorizIcon /></div>);
  }

  const renderPaginationList = () => {
    // Render all page buttons
    if (numPages <= MAX_SLOTS) {
      return Array(numPages).fill(0).map((_, idx) => renderPageButton(idx));
    }

    const leftDiff = page;
    const rightDiff = (numPages - 1) - page;
    const ellipsesLeft = leftDiff >= 4;
    const ellipsesRight = rightDiff >= 5;

    const ret: React.ReactNode[] = [];

    if (ellipsesLeft && ellipsesRight) {
      ret.push(renderPageButton(0));
      ret.push(renderEllipses());
      ret.push(renderPageButton(page-1));
      ret.push(renderPageButton(page));
      ret.push(renderPageButton(page+1));
      ret.push(renderEllipses());
      ret.push(renderPageButton(numPages-1));
    } else if (ellipsesLeft && !ellipsesRight) {
      ret.push(renderPageButton(0));
      ret.push(renderEllipses());

      for (let i = (numPages - 1) - 4; i < numPages; i++) {
        ret.push(renderPageButton(i));  
      }
    } else if (!ellipsesLeft && ellipsesRight) {
      for (let i = 0; i < 5; i++) {
        ret.push(renderPageButton(i)); 
      }
      ret.push(renderEllipses());
      ret.push(renderPageButton(numPages-1));
    } else { // !ellipsesLeft && !ellipsesRight
      for (let i = 0; i < numPages; i++) {
        ret.push(renderPageButton(i)); 
      }
    }

    return ret;
  }

  return (
    <div 
      className={classnames("PaginationControls", props.className)}
      style={{
        ...props.style,
        ["--num-pages" as any]: numPages
      }}
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