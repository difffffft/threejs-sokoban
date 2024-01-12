import * as THREE from "three"
import { MAP_SIZE, MODEL_SIZE } from '@/constans'

export const MyObjType = {
    EMPTY: 'EMPTY',
    TREE: 'TREE',
    BOX: 'BOX',
    TREE: 'TREE',
    STONE: 'STONE',
    HERO: 'HERO'
}

export class MyObj {
    constructor({ model, x, y, z, type }) {
        this.x = x
        this.y = y
        this.z = z
        this.type = type

        this.baseModel = model
        this.model = null
        // this.position = new THREE.Vector3(this.x, z, this.y);
    }

    addToScene(scene) {
        if (this.model || !this.baseModel) {
            return
        }
        const clonedModel = this.baseModel.clone();
        const x = (this.x + 0.5) * MODEL_SIZE - MAP_SIZE / 2;
        const y = (this.y + 0.5) * MODEL_SIZE - MAP_SIZE / 2;
        clonedModel.position.set(x, this.z, y);
        this.model = clonedModel
        scene.add(clonedModel);
    }
}

export class MyEmptyObj extends MyObj {
    constructor(model, x, y) {
        super({ model, x, y, z: 0, type: MyObjType.EMPTY })
    }
}

export class MyTreeObj extends MyObj {
    constructor(model, x, y) {
        super({ model, x, y, z: 2, type: MyObjType.TREE })
    }
}

export class MyBoxObj extends MyObj {
    constructor(model, x, y) {
        super({ model, x, y, z: -5, type: MyObjType.BOX })
    }
}

export class MyStoneObj extends MyObj {
    constructor(model, x, y) {
        super({ model, x, y, z: -2.5, type: MyObjType.STONE })
    }
}

export class MyHeroObj extends MyObj {
    constructor(model, x, y) {
        super({ model, x, y, z: -5, type: MyObjType.HERO })
    }
}