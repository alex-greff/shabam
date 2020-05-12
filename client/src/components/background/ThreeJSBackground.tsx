import React, { FunctionComponent, useEffect, useRef } from "react";
import { BaseProps } from "@/types"
import "./ThreeJSBackground.scss";
import classnames from "classnames";
import * as THREE from "three";
import { OrbitControls } from "three-orbitcontrols-ts";
import { TweenLite } from "gsap";
import * as Utilities from "@/utilities";

export interface Props extends BaseProps {

};

const ThreeJSBackground: FunctionComponent<Props> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        function createMainCircle(): [THREE.Mesh, THREE.ShaderMaterial] {
            const geometry = new THREE.CircleGeometry(5, 128);
            // const material = new THREE.MeshBasicMaterial({ color: "#262626" });
            geometry.computeBoundingBox();
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color1: {
                        value: new THREE.Color("#1C6498")
                    },
                    color2: {
                        value: new THREE.Color("#4BC1D1")
                    },
                    bboxMin: {
                        value: geometry.boundingBox!.min
                    },
                    bboxMax: {
                        value: geometry.boundingBox!.max
                    }
                },
                vertexShader: `
                    uniform vec3 bboxMin;
                    uniform vec3 bboxMax;
                
                    varying vec2 vUv;

                    void main() {
                        vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color1;
                    uniform vec3 color2;
                
                    varying vec2 vUv;
                    
                    void main() {
                        gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                    }
                `,
                // wireframe: true
            });

            const circle = new THREE.Mesh(geometry, material);
            circle.rotation.z = 0.25 * Math.PI;

            return [circle, material];
        }

        function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
            const canvas = renderer.domElement;
            const pixelRatio = window.devicePixelRatio;
            const width = canvas.clientWidth * pixelRatio | 0;
            const height = canvas.clientHeight * pixelRatio | 0;
            const needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
              renderer.setSize(width, height, false);
            }
            return needResize;
        }

        function isMobile() {
            const canvas = renderer.domElement;
            const pixelRatio = window.devicePixelRatio;
            const width = canvas.clientWidth * pixelRatio | 0;

            return Utilities.getBreakpoint(width) <= Utilities.Breakpoint.tabLand;
        }

        const scene = new THREE.Scene();

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            canvas: canvasRef.current!,
            antialias: true
        });
        // const renderer = new THREE.CSS3DRenderer;

        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.minDistance = 0;
        // controls.maxDistance = Infinity;
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.25;
        // controls.enableZoom = true;
        // controls.autoRotate = true;

        // orbitControls.autoRotate = 

        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        // cube.position.x = 0;
        // cube.position.y = 0;

        const [mainCircle, mainCircleMaterial] = createMainCircle();
        mainCircle.position.z = -1;
        scene.add(mainCircle);

        // Render loop
        function render() {
            if (resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            if (isMobile()) {
                if (mainCircle.position.z !== -8) {
                    mainCircle.position.z = -8;
                }
            } else {
                if (mainCircle.position.z !== -1) {
                    mainCircle.position.z = -1;
                }
            }

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);

        // One-shot test anim
        // TweenLite.to(cube.rotation, 1, {
        //     x: 1,
        //     y: 1
        // });
        // TweenLite.to(camera.position, 1, {
        //     x: 1,
        //     y: 1
        // });

        // TweenLite.to(mainCircle.scale, 1, { x: 1.2, y: 1.2 });
    }, []);

    return (
        <div className={classnames("ThreeJSBackground", props.className)}>
            <canvas 
                className="ThreeJSBackground__canvas"
                ref={canvasRef}
            ></canvas>
        </div>
    );
};

ThreeJSBackground.defaultProps = {

} as Partial<Props>;

export default ThreeJSBackground;