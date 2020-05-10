import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types"
import "./ThreeJSBackground.scss";
import classnames from "classnames";
import * as THREE from "three";

export interface Props extends BaseProps {

};

const ThreeJSBackground: FunctionComponent<Props> = (props) => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const width = rootRef.current!.clientWidth;
        const height = rootRef.current!.clientWidth;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);

        rootRef.current!.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        const animate = function () {
            requestAnimationFrame(animate);

            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

    }, []);

    return (
        <div 
            className={classnames("ThreeJSBackground", props.className)}
            ref={rootRef}
        >
            {/* WebGL canvas is injected here */}
        </div>
    );
};

ThreeJSBackground.defaultProps = {

} as Partial<Props>;

export default ThreeJSBackground;