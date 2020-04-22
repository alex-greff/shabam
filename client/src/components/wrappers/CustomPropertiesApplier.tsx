import React, { Component } from "react";
import "./CustomPropertiesApplier.scss";
import update from "immutability-helper";

import * as Utilities from "@/utilities";

export interface Props {
    properties: CSSProperties;
    useRoot: boolean;
    useEl: boolean;
    el?: HTMLElement;
}

interface State {
    currentlyUsingRoot: boolean;
}

interface CSSProperties {
    [propertyName: string]: string;
}


class CustomPropertiesApplier extends Component<Props, State> {
    static defaultProps = {
        tag: "div",
        useRoot: true,
        useEl: false
    } as Partial<Props>;

    constructor(props: Props) {
        super(props);

        this.state = {
            currentlyUsingRoot: false
        };
    }

    private validateProps(useRoot: boolean, useEl: boolean, el?: HTMLElement) {
        const bothExist = !!useRoot && !!useEl;
        if (bothExist) {
            throw `Error: only one of props 'useRoot' and 'useEl' can be specified at once`;
        }
        if (useEl && !el) {
            throw `Error: el must be specified when useEl is 'true'`;
        }
    }

    private updateRootStyles(useRoot: boolean, properties: CSSProperties) {
        if (useRoot) {
            Object.entries(properties).forEach(([name, value]) => {
                Utilities.saveCSSProperty(name, value);
            });
            
            this.setState((prevState) => update(prevState, { 
                currentlyUsingRoot: { $set: true }
            }));
        }
        if (!useRoot && this.state.currentlyUsingRoot) {
            Object.keys(properties).forEach(name => {
                Utilities.removeCSSProperty(name);
            });
            
            this.setState((prevState) => update(prevState, { 
                currentlyUsingRoot: { $set: false }
            }));
        }
    }

    private updateElementStyles(useEl: boolean, el: HTMLElement | undefined, properties: CSSProperties) {
        if (this.props.useRoot || !el) {
            return;
        }

        if (useEl) {
            Object.entries(properties).forEach(([name, value]) => {
                Utilities.saveCSSProperty(name, value, el);
            });
        } else {
            Object.keys(properties).forEach(name => {
                Utilities.removeCSSProperty(name, el);
            });
        }
    }

    componentWillMount() {
        const { useRoot, useEl, el }: Props = this.props;
        this.validateProps(useRoot, useEl, el);
    }

    componentDidMount() {
        const { useRoot, useEl, el, properties }: Props = this.props;

        if (useRoot) {
            this.setState((prevState) => update(prevState, { 
                currentlyUsingRoot: { $set: true }
            }));
        }

        this.updateRootStyles(useRoot, properties);
        this.updateElementStyles(useEl, el, properties);
    }

    // When something changed
    getSnapshotBeforeUpdate() {
        const { useRoot, useEl, el, properties }: Props = this.props;
        this.validateProps(useRoot, useEl, el);

        this.updateRootStyles(useRoot, properties);
        this.updateElementStyles(useEl, el, properties);
    }

    render() {
        return this.props.children;
    }
}

export default CustomPropertiesApplier;