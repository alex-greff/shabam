import React, { FunctionComponent } from "react";
import { BaseProps } from "@/types";
import "./AccountCatalog.scss";
import classnames from "classnames";
import { useAccountLocation } from "@/hooks/useAccountLocation";
import { useModal } from "react-modal-hook";

import PageView from "@/components/page/PageView/PageView";
import PageContent from "@/components/page/PageContent/PageContent";
import BreadcrumbTrail, {
  BreadcrumbTrailItem,
} from "@/components/nav/BreadcrumbTrail/BreadcrumbTrail";
import ConfigurationContainer from "@/components/containers/ConfigurationContainer/ConfigurationContainer";

import IconButton from "@/components/ui/buttons/IconButton/IconButton";

import AddIcon from "@material-ui/icons/Add";

import BaseModal from "@/components/modals/BaseModal/BaseModal";

export interface Props extends Omit<BaseProps, "id"> {}

const AccountCatalog: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

  const [showCreateModal, hideCreateModal] = useModal(
    ({ in: open, onExited }) => {
      return (
        <BaseModal
          open={open}
          onExited={onExited}
          onRequestClose={hideCreateModal}
        >
          Modal
          <button onClick={hideCreateModal}>Close</button>
        </BaseModal>
      );
    }
  );

  const breadcrumbItems: BreadcrumbTrailItem[] = [
    {
      name: "Account",
      location: `/account/${accountId}`,
      active: true,
    },
    {
      name: "Catalog",
      // location: `/account/${accountId}/catalog`,
    },
  ];

  const handleCatalogCreate = () => {
    console.log("TODO: open create catalog dialog");
    showCreateModal();
  };

  return (
    <PageView
      id="AccountCatalog"
      className={classnames(props.className)}
      style={props.style}
    >
      <PageContent className="AccountCatalog__content">
        <ConfigurationContainer
          className="AccountCatalog__container"
          titleClassName="AccountCatalog__header"
          renderTitle={() => (
            <>
              <BreadcrumbTrail
                className="AccountCatalog__breadcrumb-trail"
                items={breadcrumbItems}
              />
              <IconButton
                className="AccountCatalog__create-button"
                renderIcon={() => <AddIcon />}
                appearance="solid"
                onClick={handleCatalogCreate}
              >
                Create
              </IconButton>
            </>
          )}
        >
          <div className="AccountCatalog__config-container">
            TODO: add search config
          </div>
        </ConfigurationContainer>

        <div className="AccountCatalog__result-container">
          TODO: add catalog list
        </div>
      </PageContent>
    </PageView>
  );
};

export default AccountCatalog;
