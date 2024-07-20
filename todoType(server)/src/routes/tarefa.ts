import { Router } from 'express'
import { getTarefa, postTarefa, updateTarefa } from '../controllers/tarefa'

const router = Router();

router.route('/')
.get(getTarefa)
.post(postTarefa)
.patch(updateTarefa)

module.exports = router;
