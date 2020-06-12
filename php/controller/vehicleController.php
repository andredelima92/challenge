<?php

class vehicleController extends controller {
    protected $id = null;
    private $id_client = null;
    private $model = null;
    public $license_plate = null;

    public function __construct($vehicle = null)
    {
        if (!empty($vehicle->id_vehicle)) {
            $this->id = $vehicle->id_vehicle;
        }
        
        if (!empty($vehicle->id_client)) {
            $this->id_client = $vehicle->id_client;
        }
         
        if (!empty($vehicle->model)) {
            $this->model = $vehicle->model;
        }

        if (!empty($vehicle->license_plate)) {
            $this->license_plate = $vehicle->license_plate;
        }
    }

    /**
     * Metodo valida a placa do veiculo
     */
    public function validPlate($plate)
    {
        if (empty($plate) || strlen($plate) != 7) {
            lib::$return = ['status' => false, 'err' => 'Placa do veículo inválida'];
            
            return false;
        }

        return true;
    }

    public function setClient($id)
    {
        $this->id_client = $id;
    }

    protected function update()
    {
        $result = sql::update('vehicles', 'id_client = :id_client, model = :model', 'license_plate = :license_plate',
                            ['id_client' => $this->id_client, 'model' => $this->model, 'license_plate' => $this->license_plate]
        );  
            
        if ($result === false) {
            lib::$return = ['status' => false,'err' => 'Ocorreu um erro ao atualizar o veículo'];
            return false;
        }

        return true;
    }

    private function setUpdatedId()
    {
        $this->id = sql::select(
            "SELECT id_vehicle FROM vehicles WHERE license_plate = :license_plate",
            ['license_plate' => $this->license_plate]
        )[0]['id_vehicle'];
    }
    
    /**
     * Metodo responsavel por cadastrar um novo cliente
     */
    protected function insert()
    {
        if (empty($this->id_client)) {
            lib::$return = ['status' => false, 'err' => 'Dono do veículo não informado'];
            return false;
        }
        
        $result = sql::insert('vehicles', 'id_client, model, license_plate', ':id_client, :model, :license_plate', 
                            ['id_client' => $this->id_client, 'model' => $this->model, 'license_plate' => $this->license_plate]
        );
        
        if ($result === false) {
            if ($this->update() === false) {
                return false;
            }
            
            $this->setUpdatedId();
            
            return true;
        }
        
        return true;
    }
}