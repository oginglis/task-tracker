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
        newIndex: number
    }
}

export {MovedType, AddedType, RemovedType}