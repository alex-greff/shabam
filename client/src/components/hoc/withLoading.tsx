import React, { ComponentType, useState } from "react";

export interface Props {
  setIsLoading: (isLoading: boolean) => unknown;
}

function withLoading<T = unknown, P extends Props = Props>(
  WrappedComponent: ComponentType<P>,
  loadingMessage?: string
) {
  const ComponentWithLoading = React.forwardRef<T, Omit<P, keyof Props>>(
    (props, ref) => {
      const [isLoading, setIsLoading] = useState(true);

      const setIsLoadingHandler = (isLoading: boolean) =>
        setIsLoading(isLoading);

      return (
        <>
          {/* TODO: add loading component */}
          {isLoading && <div>Loading...</div>}
          <WrappedComponent
            {...(props as P)}
            ref={ref}
            setIsLoading={setIsLoadingHandler}
          />
        </>
      );
    }
  );

  return ComponentWithLoading;
}

export default withLoading;
