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
        $date1 = lib::$data->data->date->date1 . ' 00:00:01';
        $date2 = lib::$data->data->date->date2 . ' 23:59:59';
        
        $traffic = new trafficController;
        return lib::$return = ['status' => true, 'traffics' => $traffic->reportTraffics($date1, $date2)];
    }
}