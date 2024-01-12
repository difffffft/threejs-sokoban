<script setup>
import { nanoid } from "nanoid"
import { onMounted, onBeforeUnmount, ref } from "vue";

import useCreateLevel from "@/hooks/useCreateLevel";
import { useLevelStore } from '@/stores/level'
import { levelList } from "@/level"

const id = ref(nanoid())
const canvas = ref(null)

let onKeyPress = null
let onResize = null


const winDialogVisible = ref(false)
const levelStore = useLevelStore()
const onWin = () => {
    winDialogVisible.value = true
}
const onNextLevel = () => {
    winDialogVisible.value = false
    levelStore.nextLevel()
    location.reload()
}
const onLastLevel = () => {
    winDialogVisible.value = false
    levelStore.lastLevel()
    location.reload()
}
const onRefresh = () => {
    winDialogVisible.value = false
    location.reload()
}


onMounted(async () => {
    await useCreateLevel({ canvas, onKeyPress, onResize, onWin })
})
onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeyPress)
    window.removeEventListener("resize", onResize)
})
</script>

<template>
    <canvas :id="id" ref="canvas"></canvas>
    <el-dialog v-model="winDialogVisible" title="恭喜！" width="80%" draggable>
        <span>你已经成功通过本关卡！</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onLastLevel" v-if="levelStore.level > 0">上一关</el-button>
                <el-button @click="onRefresh">重玩</el-button>
                <el-button type="primary" @click="onNextLevel" v-if="levelStore.level < levelList.length - 1">下一关</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
canvas {
    width: 100%;
    height: 100%;
    color: #13a10e;
}
</style>