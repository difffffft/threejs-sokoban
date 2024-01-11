import * as THREE from "three"

// 地图大小
export const MAP_SIZE = 160

// 模型长宽
export const MODEL_SIZE = 10

// 方向
export const DIRECTOIN = {
    LEFT: () => new THREE.Euler(0, Math.PI / 2, 0),
    RIGHT: () => new THREE.Euler(0, -Math.PI / 2, 0),
    TOP: () => new THREE.Euler(0, 0, 0),
    BOTTOM: () => new THREE.Euler(0, -Math.PI, 0)
}