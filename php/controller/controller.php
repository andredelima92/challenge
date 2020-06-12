<?php

class controller {

    /**
     * Metodo responsavel por verificar se vai inserir ou atualizar uma tabela
     */
    public function insertOrUpdate()
    {
        if ($this->id === null) {
            $result = $this->insert();
            
            $lastId = sql::getLastInsertId();
            
            if ($lastId) $this->id = $lastId;
            
            return $result;
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