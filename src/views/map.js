import { MyBoxObj, MyEmptyObj, MyHeroObj, MyStoneObj, MyTreeObj, MyObjType } from './mObj'
import { loadGLTFModel } from "@/utils"
import { DIRECTOIN } from '@/constans'

// 障碍物
const treeMap = [
    { x: 4, y: 7 },
    { x: 4, y: 8 },
    { x: 4, y: 9 },
    { x: 5, y: 7 },
    { x: 5, y: 9 },
    { x: 5, y: 9 },
    { x: 6, y: 4 },
    { x: 6, y: 5 },
    { x: 6, y: 6 },
    { x: 6, y: 7 },
    { x: 6, y: 9 },
    { x: 7, y: 4 },
    { x: 7, y: 9 },
    { x: 7, y: 10 },
    { x: 7, y: 11 },
    { x: 8, y: 4 },
    { x: 8, y: 5 },
    { x: 8, y: 6 },
    { x: 8, y: 11 },
    { x: 8, y: 11 },
    { x: 9, y: 6 },
    { x: 9, y: 8 },
    { x: 9, y: 9 },
    { x: 9, y: 10 },
    { x: 9, y: 11 },
    { x: 10, y: 6 },
    { x: 10, y: 8 },
    { x: 11, y: 6 },
    { x: 11, y: 7 },
    { x: 11, y: 8 },
]

const tragetMap = [
    { x: 5, y: 8 },
    { x: 7, y: 5 },
    { x: 8, y: 10 },
    { x: 10, y: 7 },
]

const boxMap = [
    { x: 7, y: 8 },
    { x: 7, y: 7 },
    { x: 8, y: 9 },
    { x: 9, y: 7 },
]

const heroMap = {
    x: 8,
    y: 8,
    direction: DIRECTOIN.TOP()
}


export const isWin = (map) => {
    // 取出当前所在位置
    const now = []
    map.forEach(row => {
        row.forEach(col => {
            if (col.type === MyObjType.BOX) {
                now.push(String(col.x) + String(col.y))
            }
        })
    });

    // target
    const target = []
    tragetMap.forEach(item => {
        target.push(String(item.x) + String(item.y))
    })

    // 与tragetMap进行比较
    let winFlag = true
    target.forEach(item => {
        let x = now.find(nowItem => nowItem === item)
        // 没找到
        if (!x) {
            winFlag = false
        }
    })

    return winFlag
    // tragetMap全都存在，则表示游戏赢了
}


export const createMap = async (size = 16) => {
    const map = []
    let hero = null

    const { scene: treeModel } = await loadGLTFModel("/gltf/tree.glb")
    const { scene: stoneModel } = await loadGLTFModel("/gltf/stone.glb", 400)
    const { scene: boxModel } = await loadGLTFModel("/gltf/box.glb", 4)
    const { scene: heroModel } = await loadGLTFModel("/gltf/car2.glb")


    // 先生成空对象地图
    for (let i = 0; i < size; i++) {
        const row = []
        for (let j = 0; j < size; j++) {
            row.push(new MyEmptyObj(null, i, j))
        }
        map.push(row)
    }

    // 填充角色
    for (let i = 0; i < treeMap.length; i++) {
        const x = treeMap[i].x
        const y = treeMap[i].y
        map[x][y] = new MyTreeObj(treeModel, x, y)
    }
    for (let i = 0; i < tragetMap.length; i++) {
        const x = tragetMap[i].x
        const y = tragetMap[i].y
        map[x][y] = new MyStoneObj(stoneModel, x, y)
    }
    for (let i = 0; i < boxMap.length; i++) {
        const x = boxMap[i].x
        const y = boxMap[i].y
        map[x][y] = new MyBoxObj(boxModel, x, y)
    }
    hero = new MyHeroObj(heroModel, heroMap.x, heroMap.y)
    map[heroMap.x][heroMap.y] = hero

    // console.log(map);
    return { map, hero }
}