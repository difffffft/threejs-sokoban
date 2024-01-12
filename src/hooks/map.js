import { MyBoxObj, MyEmptyObj, MyHeroObj, MyStoneObj, MyTreeObj, MyObjType } from './mObj'
import { loadGLTFModel } from "@/utils"

import { levelList } from "@/level"

export const isWin = (level, map) => {
    console.log(level);
    
    const tragetMap = JSON.parse(JSON.stringify(levelList[level].tragetMap))

    // 当前所有箱子所在位置
    const now = []
    map.forEach(row => {
        row.forEach(col => {
            if (col.type === MyObjType.BOX) {
                now.push(String(col.x) + String(col.y))
            }
        })
    });

    // 当前所有目标点所在位置
    const target = []
    tragetMap.forEach(item => {
        target.push(String(item.x) + String(item.y))
    })

    // 开始比较
    let winFlag = true
    target.forEach(item => {
        let x = now.find(nowItem => nowItem === item)
        // 有一个没找到，则表示游戏还未赢
        if (!x) {
            winFlag = false
        }
    })

    return winFlag
}


export const createMap = async (level = 0, size = 16) => {
    const map = []
    const tragetMap = JSON.parse(JSON.stringify(levelList[level].tragetMap))
    const treeMap = JSON.parse(JSON.stringify(levelList[level].treeMap))
    const boxMap = JSON.parse(JSON.stringify(levelList[level].boxMap))
    const heroMap = JSON.parse(JSON.stringify(levelList[level].heroMap))

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

    return { map, hero }
}