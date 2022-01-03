interface MovedType {
    moved: {
        oldIndex: number,
        newIndex: number
    }
}

interface AddedType {
    added: {
        newIndex: number
    }
} 

interface RemovedType {
    removed: {
        oldIndex: number
    }
}

export {MovedType, AddedType, RemovedType}