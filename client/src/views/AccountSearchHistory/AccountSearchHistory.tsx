import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./AccountSearchHistory.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import HeaderedContainer from "@/components/containers/HeaderedContainer/HeaderedContainer";
import BreadcrumbTrail, { BreadcrumbTrailItem } from "@/components/nav/BreadcrumbTrail/BreadcrumbTrail";

export interface Props extends Omit<BaseProps, "id"> {}

const AccountSearchHistory: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

  const breadcrumbItems: BreadcrumbTrailItem[] = [
    {
      name: "Account",
      location: `/account/${accountId}`,
      active: true
    }, 
    {
      name: "Search History",
      // location: `/account/${accountId}/search-history`,
    }
  ];

  return (
    <PageView
      id="AccountSearchHistory"
      className={classnames(props.className)}
      style={props.style}
    >
      <PageContent className="AccountSearchHistory__content">
        <HeaderedContainer 
          className="AccountSearchHistory__container"
          renderHeader={() => (
            <BreadcrumbTrail
              items={breadcrumbItems}
            />
          )}
        >
          <div className="AccountSearchHistory__navigation">
            Stuff
          </div>
        </HeaderedContainer>
      </PageContent>
    </PageView>
  );
};

export default AccountSearchHistory;
