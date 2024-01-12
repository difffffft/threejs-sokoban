import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { levelList } from "@/level"

/**
 * 关卡
 * 记录当前用户所在关卡
 */
export const useLevelStore = defineStore('level', () => {

    // 关卡从0开始
    const level = ref(localStorage.getItem("LEVEL") ? Number(localStorage.getItem("LEVEL")) : 0)

    // 上一关
    function lastLevel() {
        level.value--
        saveLevel()
    }

    // 下一关
    function nextLevel() {
        level.value++
        if (level.value > levelList.length - 1) {
            throw new Error("已经到达最大关卡")
        }
        saveLevel()
    }


    function saveLevel() {
        localStorage.setItem("LEVEL", level.value)
    }

    return { level, lastLevel, nextLevel }
})
