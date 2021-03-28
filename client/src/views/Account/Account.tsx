import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./Account.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import HeaderedContainer from "@/components/containers/HeaderedContainer/HeaderedContainer";
import BackgroundContainer from "@/components/containers/BackgroundContainer/BackgroundContainer";
import BreadcrumbTrail, { BreadcrumbTrailItem } from "@/components/nav/BreadcrumbTrail/BreadcrumbTrail";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";


export interface Props extends Omit<BaseProps, "id"> {}

const Account: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

  const breadcrumbItems: BreadcrumbTrailItem[] = [
    {
      name: "Account",
      location: `/account/${accountId}`,
      active: true
    }
  ];

  const handleDeleteAccount = () => {
    console.log("TODO: delete account");
  };

  return (
    <PageView
      id="Account"
      className={classnames(props.className)}
      style={props.style}
    >
      <PageContent className="Account__content">
        <HeaderedContainer 
          className="Account__container"
          renderHeader={() => (
            <BreadcrumbTrail
              items={breadcrumbItems}
            />
          )}
        >
          <div className="Account__navigation">
            <NormalButton
              className="Account__btn-search-history"
              appearance="solid"
              path={`/account/${accountId}/search-history`}
            >
              Search History
            </NormalButton>

            <NormalButton
              className="Account__btn-account-catalog"
              appearance="solid"
              path={`/account/${accountId}/catalog`}
            >
              Account Catalog
            </NormalButton>
          </div>

          <BackgroundContainer
            className="Account__info-container"
          >
            TODO: account info
          </BackgroundContainer>

          <div className="Account__suffix-container">
            <NormalButton
              appearance="solid"
              mode="error"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </NormalButton>
          </div>
        </HeaderedContainer>
      </PageContent>
    </PageView>
  );
};

export default Account;
