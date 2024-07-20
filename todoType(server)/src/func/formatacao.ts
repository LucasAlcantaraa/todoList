export const dataFormatadaInvertida = () => {
    const data = new Date();
    return data.toISOString().slice(0, 10);
}

export const dataFormatada = () => {
    const data = new Date();
    return data.toLocaleDateString('pt-BR');
}

export const formatData = (data: Date): string => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + 1);

    const dia = novaData.getDate().toString().padStart(2, '0');
    const mes = (novaData.getMonth() + 1).toString().padStart(2, '0'); // +1 porque o mês começa em zero
    const ano = novaData.getFullYear();

    return `${dia}/${mes}/${ano}`;
};

export const dataAnteriorInvertida = () => {
    const data = new Date();
    data.setDate(data.getDate() - 7);
    return data.toISOString().slice(0, 10);
}
