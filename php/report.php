<?php

class report {
    /**
     * Metodo solicita os melhores clientes
     */
    public function bestClients ()
    {
        $client = new clientController;
        return lib::$return = ['status' => true, 'clients' => $client->reportBestClients()];
    }

    public function totalTrafficsByData() 
    {
        $traffic = new trafficController;
        dd(lib::$data->data);
        // reportTraffics
    }
}