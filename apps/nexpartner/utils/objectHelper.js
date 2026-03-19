// Helper industrial para mesclar configurações de deploy
// M4-L04: Vulnerável a Prototype Pollution por não filtrar chaves sensíveis (__proto__)
export const deepMerge = (target, source) => {
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
};
