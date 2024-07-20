export const validarPesquisa = (obj: Record<string, any>, chaves: string[]) => {
    if (!Object.keys(obj).length) {
        throw new Error("Nenhum dado Passado");
    }
    for (let chave of chaves) {
        if (obj[chave] === undefined || (obj[chave] === "")) {
            throw new Error(`Falta campo obrigatório '${chave}'`);
        }
    }
    return obj
};