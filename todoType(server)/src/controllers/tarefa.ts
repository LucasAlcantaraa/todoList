import { Request, Response, NextFunction } from "express";
import { Tarefa } from '../models/tarefa';
import { validarPesquisa } from '../func/validacao';
import { formatData } from '../func/formatacao';
import { retornarConsultaPaginada } from "../func/paginacao";

export const getTarefa = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query
    try {
        let consulta: object = {}; // Inicializa o filtro vazio

        if (Object.keys(params).length > 0) {
            const pesquisa = tratarParams(params);
            consulta = { $and: pesquisa };
        }

        const resultado = await Tarefa.find(consulta).exec();

        const newVencimento = resultado.map((objeto) => {
            if (objeto.vencimento) {
                const newFormated = formatData(objeto.vencimento);
                return {
                    _id: objeto._id,
                    tarefa: objeto.tarefa,
                    vencimento: newFormated,
                    concluido: objeto.concluido
                };
            }
            return objeto;
        });

        const newResult = retornarConsultaPaginada(newVencimento, 3)
        res.status(200).json(newResult)
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}

export const postTarefa = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.body
    console.log(params)
    try {
        const pesquisa = validarPesquisa(params, ['tarefa', 'vencimento'])
        const novaTarefa = new Tarefa({
            tarefa: pesquisa.tarefa,
            vencimento: new Date(pesquisa.vencimento),
            concluido: false,
        });
        await novaTarefa.save();

        res.status(201).json({ mensagem: 'Nova tarefa adicionada com sucesso!' })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteTarefa = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.query
    try {
        const pesquisa = validarPesquisa(params, ['_id'])

        await Tarefa.deleteOne({ _id: pesquisa._id })

        res.status(200).json({ mensagem: `A tarefa de _id: ${pesquisa._id} foi excluída` })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const updateTarefa = async (req: Request, res: Response, next: NextFunction) => {
    const params = req.body

    const { _id, set } = params

    if (!_id || !set) {
        return res.status(400).json({ error: 'Parâmetros inválidos' });
    }
    try {
        const updateSet: { [key: string]: any } = new Object()

        if (set.tarefa) {
            updateSet.tarefa = set.tarefa
        }
        if (set.vencimento) {
            updateSet.vencimento = new Date(set.vencimento)
        }
        if (set.concluido) {
            updateSet.concluido = set.concluido === 'true'
        }

        await Tarefa.updateOne({ _id: _id }, { $set: updateSet })

        res.status(200).json({ mensagem: `A tarefa de _id: ${_id} foi atualizada com sucesso` })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

function tratarParams(obj: Record<string, any>) {
    const array: Object[] = [];

    if (obj.tarefa) {
        array.push({ tarefa: new RegExp(obj.tarefa, 'i') });
    }

    if (obj.concluido) {
        array.push({ concluido: obj.concluido === 'true' });
    }

    if (obj.vencimento) {
        const vencimento = obj.vencimento.split(',');
        if (vencimento.length === 2) {
            array.push({
                vencimento: {
                    $gte: new Date(vencimento[0]) ?? new Date(),
                    $lt: new Date(vencimento[1]) ?? new Date()
                }
            });
        }
    }
    // RETORNO ESPERADO    
    //[
    //     { nome: new RegExp(pesquisa.nome, 'i') },
    //     { vencimento: { $gte: new Date(pesquisa.vencimento.datainicial), $lt: new Date(pesquisa.vencimento.datafinal) } },
    //     { concluido: pesquisa.concluido }
    // ]
    return array;
}