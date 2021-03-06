<?php

class vehicleController extends controller {
    protected $id = null;
    private $model = null;
    private $amount_parking = null;
    public $license_plate = null;

    public function __construct($vehicle = null)
    {
        if (!empty($vehicle->id_vehicle)) {
            $this->id = $vehicle->id_vehicle;
        }
        
        if (!empty($vehicle->model)) {
            $this->model = $vehicle->model;
        }

        if (!empty($vehicle->amount_parking)) {
            $this->amount_parking = $vehicle->amount_parking;
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
            lib::$return['err'] = 'Placa do veículo inválida';
            
            return false;
        }

        return true;
    }

    public function update()
    {
        $result = false;

        if ($this->id) {
            $result = sql::update('vehicles', 'model = :model, license_plate = :license_plate', 'id_vehicle = :id_vehicle',
                            ['model' => $this->model, 'license_plate' => $this->license_plate, 'id_vehicle' => $this->id]
            );
        } else {
            $result = sql::update('vehicles', 'model = :model', 'license_plate = :license_plate',
                            ['model' => $this->model, 'license_plate' => $this->license_plate]
            );
        }
        
        if ($result === false) {
            lib::$return['err'] = 'Ocorreu um erro ao atualizar o veículo';

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
     * Metodo responsavel por cadastrar um novo veiculo
     */
    protected function insert()
    {
        $result = sql::insert('vehicles', 'model, license_plate', ':model, :license_plate', 
                            ['model' => $this->model, 'license_plate' => $this->license_plate]
        );
        
        if ($result === false) {
            if ($this->update() === false) {
                return false;
            }
            
            $this->setUpdatedId();
            
            return true;
        }
        lib::$return['newVehicle'] = true;
        return true;
    }
}