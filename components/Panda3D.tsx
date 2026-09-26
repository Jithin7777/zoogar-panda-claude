// Drei is imported per module rather than from '@react-three/drei/native':
// the root entry re-exports every helper, including one (stats-gl) that
// bundles a second copy of three.js.
import { Center } from '@react-three/drei/core/Center';
import { useGLTF } from '@react-three/drei/core/Gltf';
import { Canvas, useThree } from '@react-three/fiber/native';
import { Suspense, useLayoutEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Box3, MathUtils, PerspectiveCamera, Vector3 } from 'three';

// Metro turns this into a bundled asset reference, which React Three Fiber's
// native loader resolves. Drei's types only list string paths, hence the cast.
const pandaModel = require('../assets/models/panda.glb') as string;

// Share of the canvas the model fills along its limiting dimension (height or
// width, whichever runs out first). The rest is breathing room so the ears and
// edges are never clipped.
const FILL = 1.0;

function PandaModel() {
  // Draco disabled: this model isn't Draco-compressed, so no decoder is fetched.
  const { scene } = useGLTF(pandaModel, false);
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const { width, height } = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);

  const modelSize = useMemo(() => new Box3().setFromObject(scene).getSize(new Vector3()), [scene]);

  // Move the camera so the model's front face fills FILL of the canvas.
  // At distance d, a perspective camera sees 2·d·tan(fov/2) units vertically
  // and aspect times that horizontally; solve for d on both axes and take the
  // larger one so the model fits in both. Distances are measured to the front
  // of the bounding box, since the nearest parts appear largest.
  useLayoutEffect(() => {
    if (width === 0 || height === 0) return;

    const tanHalfFov = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const aspect = width / height;
    const fitHeight = modelSize.y / 2 / (tanHalfFov * FILL);
    const fitWidth = modelSize.x / 2 / (tanHalfFov * aspect * FILL);
    const distance = Math.max(fitHeight, fitWidth) + modelSize.z / 2;

    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, width, height, modelSize, invalidate]);

  // The GLB's parts are offset from the origin; Center moves the whole model
  // so its bounding box is centered on the camera's line of sight.
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

// Fills its parent; the parent decides how much space the panda gets.
export function Panda3D() {
  return (
    <View className="flex-1">
      <Canvas
        // Static model: only render when something changes, not every frame.
        frameloop="demand"
        camera={{ position: [0, 0, 5], fov: 40 }}
        // Match the Home screen background (#F7F7F7) so the GL surface blends in.
        onCreated={({ gl }) => gl.setClearColor('#F7F7F7')}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 5, 5]} intensity={1.8} />
        <Suspense fallback={null}>
          <PandaModel />
        </Suspense>
      </Canvas>
    </View>
  );
}
