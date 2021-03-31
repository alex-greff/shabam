import React, { FunctionComponent, useState } from "react";
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
import { useBaseModal } from "@/hooks/modals/useBaseModal";
import { useAssertionModal } from "@/hooks/modals/useAssertionModal";
import { useConfirmationModal } from "@/hooks/modals/useConfirmationModal";

export interface Props extends Omit<BaseProps, "id"> {}

const AccountCatalog: FunctionComponent<Props> = (props) => {
  const accountId = useAccountLocation();

  // TODO: remove
  // const [showCreateModal, hideCreateModal] = ueModal(
  //   ({ in: open, onExited }) => {
  //     return (
  //       <BaseModal
  //         open={open}
  //         onExited={onExited}
  //         onRequestClose={hideCreateModal}
  //       >
  //         <div
  //           // style={{ maxWidth: "30rem", width: "100vw" }}
  //         >
  //           Modal
  //           <button onClick={hideCreateModal}>Close</button>
  //         </div>
  //       </BaseModal>
  //     );
  //   }
  // );

  // // TODO: remove
  // const [temp, setTemp] = useState(0);
  // const [showCreateModal, hideCreateModal] = useBaseModal(() => {
  //   return (
  //     <div>
  //       Modal &nbsp; {temp} &nbsp;
  //       <button onClick={() => setTemp(temp + 1)}>Temp++</button>
  //       <button onClick={hideCreateModal}>Close</button>
  //     </div>
  //   );
  // }, [temp, setTemp]);

  // // TODO: remove
  // const [temp, setTemp] = useState(0);
  // const [showCreateModal, hideCreateModal] = useAssertionModal(() => {
  //   return (
  //     <div>
  //       Modal &nbsp; {temp} &nbsp;
  //       <button onClick={() => setTemp(temp + 1)}>Temp++</button>
  //       <button onClick={hideCreateModal}>Close</button>
  //     </div>
  //   );
  // }, [temp, setTemp]);

  // TODO: remove
  const [temp, setTemp] = useState(0);
  const [showCreateModal, hideCreateModal] = useConfirmationModal(() => {
    return (
      <div>
        Modal &nbsp; {temp} &nbsp;
        <button onClick={() => setTemp(temp + 1)}>Temp++</button>
        <button onClick={hideCreateModal}>Close</button>
      </div>
    );
  }, [temp, setTemp]);

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
