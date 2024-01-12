import * as THREE from "three"
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { MODEL_SIZE } from '@/constans'


// 加载GLTF
export const loadGLTFModel = (url, scale = 0) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => {
                const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
                const modelScale = MODEL_SIZE / ((boundingBox.max.x - boundingBox.min.x) + scale);
                gltf.scene.scale.set(modelScale, modelScale, modelScale);
                resolve(gltf);
            },
            (xhr) => {
                // const percentComplete = (xhr.loaded / xhr.total) * 100;
                // console.log(`模型加载进度: ${Math.round(percentComplete)}%`);
            },
            (error) => {
                reject(error);
            }
        );
    });
}
