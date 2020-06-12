<?php

class controller {

    /**
     * Metodo responsavel por verificar se vai inserir ou atualizar uma tabela
     */
    public function insertOrUpdate()
    {
        if ($this->id === null) {
            return $this->insert();
        }
    }

    /**
     * Retorna o id do registro solicitado
     */
    public function getId()
    {
        return $this->id;
    }
}