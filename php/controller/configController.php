<?php

class configController {
    private $id = 1;
    public $parking_space = null;
    public $hour_value = null;
    public $prefix = null;

    public function __construct()
    {
        $this->select();
    }

    /**
     * Metodo entrega as configurações do sistema
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * metodo pega as configurações do sistema e popula os parametros
     */
    private function select()
    {
        $result = sql::select(
            "SELECT parking_space, hour_value, prefix FROM configs WHERE id_config = :id_config",
            ['id_config'=> $this->id]
        )[0];
        
        $this->parking_space = $result['parking_space'];
        $this->hour_value = $result['hour_value'];
        $this->prefix = $result['prefix'];

        return $result;
    }
}