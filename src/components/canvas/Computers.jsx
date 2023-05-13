import React, { Suspense, useEffect, useState   } from "react";
import { Canvas, useLoader,useFrame  } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const gltf = useLoader(GLTFLoader, "./doc/scene.gltf");
  const [mixer, setMixer] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
    const elapsedTime = state.clock.getElapsedTime()*3; // lấy thời gian đã trôi qua
    const radius = 20; // bán kính của chu trình quay
    state.camera.position.x = Math.sin(elapsedTime / 10) * radius; // tính vị trí x
    state.camera.position.y = 2; // giữ y cố định
    state.camera.position.z = Math.cos(elapsedTime / 10) * radius; // tính vị trí z
    state.camera.lookAt(0, 0, 0);
    // state.camera.position.x += 0.1;
  });
  
  useEffect(() => {
    if (gltf.animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(gltf.scene);
      const animationAction = newMixer.clipAction(gltf.animations[0]);
      animationAction.setLoop(THREE.LoopRepeat);
      animationAction.play();
      setMixer(newMixer);
    }
  }, [gltf]);
  const handleMouseDown = () => {
    setIsMouseDown(true); // Thay đổi giá trị của biến isMouseDown khi chuột click vào canvas
  };

  const handleMouseUp = () => {
    setIsMouseDown(false); // Thay đổi giá trị của biến isMouseDown khi chuột thả ra khỏi canvas
  };

  return (  
   <group>
      <mesh>
        <hemisphereLight intensity={0.15} groundColor='black' /> 
        <spotLight
          position={[-20, 50, 10]}
          angle={0.12}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={1} />
        <primitive
          object={gltf.scene}
          scale={isMobile ? 10 : 11}
          position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]} 
          // rotation={[-0.01, -0.2, -0.1]}
          // scale = {isMobile ? 0.045:0.065}
          // position = {isMobile ? [0, -3 , -2]: [0, -3.25, -1.5]}
          rotation = {[0,0,0]}
        />
      </mesh>
    </group>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
