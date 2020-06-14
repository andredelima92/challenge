<?php

class traffic {

    /**
     * Metodo solicita todos os traffics em uso
     */
    public function getUsingTraffics ()
    {
        $traffic = new trafficController();

        return lib::$return = ['status' => true, 'traffics' => $traffic->getUsingTraffics()];
    }

    /**
     * Metodo insere um registro no traffics
     * valida se as informações informadas para cadastro de cliente e veiculo estão corretos
     * e atualiza o dono do veiculo caso o mesmo ja possua um cadastro
     */
    public function new () 
    {
        $client = new clientController(lib::$data->data->client);
        $vehicle = new vehicleController(lib::$data->data->vehicle);
        $traffic = new trafficController(lib::$data->data->traffic);
        $config = new configController;
        
        $diff = $config->parking_space - $traffic->parking_space;
        
        if ($diff < 0 || $traffic->parking_space <= 0) {
            lib::$return = ['status' => false, 'err' => 'Vaga de estacionamento inexistente'];
            return false;
        }

        $free = $traffic->spotIsFree($traffic->parking_space);

        if ($free === false) {
            lib::$return = ['status' => false, 'err' => 'Vaga de estacionamento ocupada'];
            return false;
        }
        
        if ($vehicle->validPlate($vehicle->license_plate) === false) {
            return false;
        }

        if ($traffic->isBusy($vehicle->license_plate) === true) {
            return false;
        }

        if ($client->insertOrUpdate() === false) {
            return false;
        }        

        lib::$return['client'] = $client->getId();

        if ($vehicle->insertOrUpdate() === false) {
            return false;
        }

        lib::$return['vehicle'] = $vehicle->getId();

        $traffic->setClient($client->getId());
        $traffic->setVehicle($vehicle->getId());
        
        $result = $traffic->insertOrUpdate();
        
        if ($result === false) return false;
        
        lib::$return['status'] = true;
        return lib::$return['traffic'] = $traffic->getTraffic();
    }
}