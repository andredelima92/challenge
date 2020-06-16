<?php

class configController {
    private $id = 1;
    public $parking_space = null;
    public $hour_value = null;

    public function __construct($conf = null)
    {
        if ($conf === null){
            return $this->select();
        }

        $this->parking_space = $conf->parking_space;
        $this->hour_value = $conf->hour_value;
    }

    /**
     * Metodo entrega as configurações do sistema
     */
    public function getConfig()
    {
        return ['parking_space' => $this->parking_space, 'hour_value' => $this->hour_value];
    }

    /**
     * metodo pega as configurações do sistema e popula os parametros
     */
    private function select()
    {
        $result = sql::select(
            "SELECT parking_space, hour_value FROM configs WHERE id_config = :id_config",
            ['id_config'=> $this->id]
        )[0];
        
        $this->parking_space = $result['parking_space'];
        $this->hour_value = $result['hour_value'];

        return $result;
    }

    public function update()
    {
        $result = sql::update(
            'configs',
            'parking_space = :parking_space, hour_value = :hour_value', 
            'id_config = 1',
            ['parking_space' => $this->parking_space, 'hour_value' => $this->hour_value]
        );
        
        if (!$result) {
            lib::$return['err'] = 'Ocorreu um erro ao atualizar as informações';
            return false;   
        }

        return true;
    }
}