<script setup>
import { nanoid } from "nanoid";
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/Addons.js'

import { createMap, isWin } from './map'
import { MyObjType } from './mObj'
import { DIRECTOIN, MODEL_SIZE } from '@/constans'
import { MyBoxObj, MyEmptyObj, MyHeroObj, MyStoneObj, MyTreeObj } from './mObj'


const id = ref(nanoid())
const canvas = ref(null)
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
let onKeyPress = null
let onResize = null

onMounted(async () => {
    const boxSize = 160
    const gridSize = 10
    const gridNum = boxSize / gridSize
    const { map, hero } = await createMap(gridNum)

    // 场景
    const scene = new THREE.Scene();
    // 相机
    const camera = new THREE.PerspectiveCamera(
        45,
        width.value / height.value,
        10,
        10000
    );
    camera.position.set(0, 200, 200);
    camera.lookAt(scene.position);
    scene.add(camera);
    // 渲染器
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
    })
    renderer.setSize(width.value, height.value)

    // 灯光
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(40, 20, 0);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(light, ambientLight);

    // 平面
    const planeLoader = new THREE.TextureLoader();
    const planeTexture = planeLoader.load('/texture/images/grass.png');
    planeTexture.wrapS = THREE.RepeatWrapping
    planeTexture.wrapT = THREE.RepeatWrapping
    planeTexture.repeat.set(4, 4)

    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x13a10e, map: planeTexture })
    const planeGeometry = new THREE.BoxGeometry(boxSize, boxSize, gridSize)
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -1 * gridSize
    scene.add(plane)

    // 添加地图
    map.forEach(row => {
        row.forEach(col => {
            col.addToScene(scene)
        })
    })

    // 添加轨道控制器, 轨道可是是其他元素
    const controls = new OrbitControls(camera, canvas.value)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // 监听窗口的变化
    onResize = () => {
        width.value = window.innerWidth
        height.value = window.innerHeight
        renderer.setSize(width.value, height.value)
        camera.aspect = width.value / height.value
        //更新相机投影矩阵
        camera.updateProjectionMatrix()
    }

    const handleDirection = (targetRotation, callback) => {
        if (hero.model.rotation.equals(targetRotation)) {
            callback()
            return
        }
        hero.model.rotation.copy(targetRotation)
    }

    const handleMoveX = (flag) => {
        const heroModel = map[hero.x][hero.y]

        // 如果该方向上只有一个箱子
        const nextX = flag === 'left' ? hero.x - 1 : hero.x + 1
        const nextNextX = flag === 'left' ? nextX - 1 : nextX + 1
        const nextY = hero.y

        const nextModel = map[nextX][nextY]
        if (nextModel.type === MyObjType.BOX) {
            const nextNextModel = map[nextNextX][nextY]
            if (nextNextModel.type === MyObjType.BOX || nextNextModel.type === MyObjType.TREE) {
                // 推不动了
            } else {
                // 推箱子
                flag === 'left' ? nextModel.model.position.x -= MODEL_SIZE : nextModel.model.position.x += MODEL_SIZE

                // 原来箱子的位置，更新为空
                map[nextX][nextY] = new MyEmptyObj(null, nextX, nextY)
                // 箱子的新位置
                nextModel.x = nextNextX
                map[nextNextX][nextY] = nextModel

                // 移动英雄
                flag === 'left' ? hero.model.position.x -= MODEL_SIZE : hero.model.position.x += MODEL_SIZE
                // 英雄原来的位置，更新为空
                map[hero.x][hero.y] = new MyEmptyObj(null, hero.x, hero.y)
                // 英雄新的位置
                heroModel.x = nextX
                map[nextX][nextY] = heroModel
            }
        } else if (nextModel.type === MyObjType.TREE) {
            // 推不了
        } else if (nextModel.type === MyObjType.EMPTY) {
            // 移动英雄
            flag === 'left' ? hero.model.position.x -= MODEL_SIZE : hero.model.position.x += MODEL_SIZE
            // 英雄原来的位置，更新为空
            map[hero.x][hero.y] = new MyEmptyObj(null, hero.x, hero.y)
            // 英雄新的位置
            heroModel.x = nextX
            map[nextX][nextY] = heroModel
        }
    }

    const handleMoveY = (flag) => {
        const heroModel = map[hero.x][hero.y]
        // 如果该方向上只有一个箱子
        const nextX = hero.x
        const nextY = flag === 'top' ? hero.y - 1 : hero.y + 1
        const nextNextY = flag === 'top' ? nextY - 1 : nextY + 1

        const nextModel = map[nextX][nextY]
        if (nextModel.type === MyObjType.BOX) {
            const nextNextModel = map[nextX][nextNextY]
            if (nextNextModel.type === MyObjType.BOX || nextNextModel.type === MyObjType.TREE) {
                // 推不动了
            } else {
                // 推箱子
                flag === 'top' ? nextModel.model.position.z -= MODEL_SIZE : nextModel.model.position.z += MODEL_SIZE
                // 原来箱子的位置，更新为空
                map[nextX][nextY] = new MyEmptyObj(null, nextX, nextY)
                // 箱子的新位置
                nextModel.y = nextNextY
                map[nextX][nextNextY] = nextModel

                // 移动英雄
                flag === 'top' ? hero.model.position.z -= MODEL_SIZE : hero.model.position.z += MODEL_SIZE
                // 英雄原来的位置，更新为空
                map[hero.x][hero.y] = new MyEmptyObj(null, hero.x, hero.y)
                // 英雄新的位置
                heroModel.y = nextY
                map[nextX][nextY] = heroModel
            }
        } else if (nextModel.type === MyObjType.TREE) {
            // 推不了
        } else if (nextModel.type === MyObjType.EMPTY) {
            // 移动英雄
            flag === 'top' ? hero.model.position.z -= MODEL_SIZE : hero.model.position.z += MODEL_SIZE
            // 英雄原来的位置，更新为空
            map[hero.x][hero.y] = new MyEmptyObj(null, hero.x, hero.y)
            // 英雄新的位置
            heroModel.y = nextY
            map[nextX][nextY] = heroModel
        }
    }

    const handleMove = (d) => {
        switch (d) {
            case 'left':
                handleMoveX(d)
                break;
            case 'right':
                handleMoveX(d)
                break;
            case 'top':
                handleMoveY(d)
                break;
            case 'bottom':
                handleMoveY(d)
                break;
        }
        if (isWin(map)) {
            console.log('赢了');
        }
    }

    // 创建一个函数来处理键盘事件
    onKeyPress = (event) => {
        switch (event.keyCode) {
            case 37: // 左箭头键
                {
                    const targetDirection = DIRECTOIN.LEFT()
                    handleDirection(targetDirection, () => {
                        handleMove('left')
                    })
                    break
                }

            case 38: // 上箭头键
                {
                    const targetDirection = DIRECTOIN.TOP()
                    handleDirection(targetDirection, () => {
                        handleMove('top')
                    })
                    break
                }
            case 39: // 右箭头键
                {
                    const targetDirection = DIRECTOIN.RIGHT()
                    handleDirection(targetDirection, () => {
                        handleMove('right')
                    })
                    break
                }
            case 40: // 下箭头键
                {
                    const targetDirection = DIRECTOIN.BOTTOM()
                    handleDirection(targetDirection, () => {
                        handleMove('bottom')
                    })
                    break
                }
            // 处理向下的作
        }
    }


    window.addEventListener("resize", onResize)
    document.addEventListener('keydown', onKeyPress, false);

    function animate() {
        controls.update()
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
})

onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeyPress)
    window.removeEventListener("resize", onResize)
})
</script>

<template>
    <canvas :id="id" ref="canvas"></canvas>
</template>

<style scoped>
canvas {
    width: 100%;
    height: 100%;
    color: #13a10e;
}
</style>