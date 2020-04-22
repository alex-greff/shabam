import React, { Component } from "react";
import { observer } from "mobx-react";

import CustomPropertiesApplier, { Props as CPAProps } from "@/components/wrappers/CustomPropertiesApplier";
import { themeStore } from "@/store/theme/theme.store";

export interface Props extends CPAProps {
    namespace?: string;
    theme?: string;
};

@observer
class ThemeProvider extends Component<Props, any> {
    static defaultProps = {

    } as Partial<Props>;

    // Makes sure the props are valid
    private validateProps(namespace: string | undefined, theme: string | undefined) {
        const bothExist = !!namespace && !!theme;
        const neitherExist = !namespace && !theme;
        if (bothExist) {
            throw `Error: only one of props 'namespace' and 'theme' can be specified at once`;
        }
        if (neitherExist) {
            throw `Error: one of props 'namespace' and 'theme' must be specified`;
        }
    }

    get themeProperties() {
        const { namespace, theme }: Props = this.props;
        // Every time this is recomputed check the props
        this.validateProps(namespace, theme);
        
        // Get the related theme data
        const themeName = (namespace) ? themeStore.getNamespace(namespace) : theme;
        const themeData = themeStore.getTheme(themeName!);
        return (themeData) ? themeData["properties"] : {};
    }

    componentWillMount() {
        const { namespace, theme }: Props = this.props;
        this.validateProps(namespace, theme);
    }

    render() {
        return (
            <CustomPropertiesApplier {...this.props} properties={this.themeProperties}>
                { this.props.children}
            </CustomPropertiesApplier>
        );
    }
}

export default ThemeProvider;