<?php

class vehicle {

    private $vehicle;

    public function __construct()
    {
        $vehicle = null;
        
        if (!empty(lib::$data->data->vehicle)) {
            $vehicle = lib::$data->data->vehicle;
        }
        
        $this->vehicle = new vehicleController($vehicle);
    }


    /**
     * Metodo solicita todos os veiculos
     */
    public function get ()
    {
        return lib::$return = ['status' => true, 'vehicles' => $this->vehicle->get('vehicles')];
    }

     /**
     * Metodo responsavel por atualizar o cadastro de um veiculo
     */
    public function updt () 
    {
        if ($this->vehicle->update() === true) {
            return lib::$return['status'] = true;
        }
    }
}