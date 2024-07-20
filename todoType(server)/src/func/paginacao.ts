export const retornarConsultaPaginada = (consulta: any[], itensPorPagina: number) => {
    const resultado: Record<number, any[]> = {};
    let paginaAtual = 1;
    let contador = 0;
    let itens: any[] = [];

    for (let i = 0; i < consulta.length; i++) {
        itens.push(consulta[i]);
        contador++;

        if (contador === itensPorPagina) {
            resultado[paginaAtual] = itens;
            itens = [];
            contador = 0;
            paginaAtual++;
        }
    }

    // Adiciona os itens restantes na última página, se houver
    if (itens.length > 0) {
        resultado[paginaAtual] = itens;
    }

    return resultado;
};
