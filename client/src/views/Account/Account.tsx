import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./Account.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import HeaderedContainer from "@/components/containers/HeaderedContainer/HeaderedContainer";

import NormalButton from "@/components/ui/buttons/NormalButton/NormalButton";

export interface Props extends Omit<BaseProps, "id"> {}

const Account: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

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
            <>
              Account View
            </>
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
        </HeaderedContainer>
      </PageContent>
    </PageView>
  );
};

export default Account;
